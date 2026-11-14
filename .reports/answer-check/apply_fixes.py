"""Apply the approved answer-key verdict (VERDICT.md) to the braindump set.

Reads  source/other/braindumps/questions.json   (site original, untouched)
Writes source/other/braindumps/questions-fixed.json (549 questions)
Run:   python -I .reports/answer-check/apply_fixes.py
"""
import json, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = ROOT / "source/other/braindumps/questions.json"
OUT = ROOT / "source/other/braindumps/questions-fixed.json"
POL = json.load(open(ROOT / ".reports/answer-check/policies.json", encoding="utf-8"))

# id -> (new key, corrected English explanation). The site's explanation argued for its wrong key.
KEY = {
    88: (["A"], "Requester Pays makes the requester (the marketing firm) pay for the requests and the data downloaded, so the company's own transfer costs stay as low as possible. Cross-Region Replication would make the company pay inter-Region transfer and storage for a full copy. Cross-account access alone still leaves the company paying egress. Intelligent-Tiering optimises storage, not transfer."),
    110: (["C", "D"], "Upload directly from the browser to S3 with a presigned URL, so the web servers are no longer in the upload path (faster, decoupled). An S3 Event Notification then invokes Lambda to resize each image asynchronously. Uploading via the web server (B) keeps the coupling and the slowness; Glacier is for archives; a scheduled resize adds delay."),
    239: (["B"], "A Lambda function URL gives the function a dedicated HTTPS endpoint, and AuthType AWS_IAM makes callers sign requests with IAM (SigV4). Nothing else to deploy, so it is the most operationally efficient. API Gateway with IAM auth also works but is an extra service to configure. Lambda@Edge / CloudFront Functions are for edge request handling and CloudFront Functions can't run Go or use IAM auth."),
    302: (["A", "C"], "Choose two. CloudFront caches and delivers the videos from edge locations close to mobile users (less buffering, scales automatically). Elastic Transcoder (now superseded by AWS Elemental MediaConvert) converts the large raw clips into mobile-friendly formats with no servers to manage. DataSync replication, EC2 fleets in Local Zones, or EC2 transcoding fleets all add operational overhead."),
    308: (["B", "C"], "With consolidated billing, the payer (consolidated billing) account sees Trusted Advisor checks across all member accounts at once. The DB instances are active On-Demand instances that have run for 90 days, so the check that reduces cost is Amazon RDS Reserved Instance Optimization. The Idle DB Instances check doesn't apply to busy instances, and the Redshift check is for a different service."),
    539: (["C"], "AWS Elastic Disaster Recovery continuously replicates the VM's disks at block level (RPO in seconds) into a low-cost staging area and launches recovery instances in minutes (RTO well under 60 minutes): a pilot-light model at the lowest cost. A warm standby RDS + DMS keeps a database running all the time (more cost), Enterprise Always On active/active is the most expensive, and nightly backups miss the 30-second RPO."),
    275: (["A"], "The slowdown happens at a predictable time every morning, so a scheduled action that raises the desired capacity to 20 just before the office opens fixes it, and the group can still scale in later in the day to save cost. Setting min and max to 20 (D) locks the group at 20 all day. Dynamic step/target tracking policies still react only after the load arrives."),
    390: (["B", "D"], "The question asks for solutions that each store session data durably and outside the instances. A DynamoDB table or an ElastiCache for Redis cluster both act as a shared external session store, so any instance behind the ALB can serve the user. Sticky sessions only pin a user to one instance and store nothing (the session is lost if the instance goes away). Cognito user pools handle sign-in, not application session state; Systems Manager Application Manager is an operations tool."),
    394: (["B"], "On RDS for MySQL, gp3 storage of 400 GiB or more is striped and has a 12,000 IOPS baseline, and you can provision 12,000-64,000 IOPS in place, so raising the gp3 IOPS above 20,000 removes the bottleneck. Provisioned IOPS io2 (C) would also work but costs more and needs a storage-type change. RDS does not let you attach two separate volumes (D), and magnetic storage is slower."),
    419: (["A", "C"], "Turn on EBS encryption by default (an EC2 account attribute, set per Region) with a default KMS key, so every new volume is encrypted automatically with no change for employees. Add an SCP on the root OU that denies ec2:CreateVolume when ec2:Encrypted is false; SCPs also apply to the root user, which IAM permission boundaries and IAM policies cannot. AWS Organizations has no organisation-wide default EBS encryption setting (E)."),
    482: (["A"], "100 GB over a 100 Mbps link takes only about 2-3 hours, and it is a one-time copy since new data goes straight to S3. aws s3 sync uses HTTPS, so the data is encrypted in transit, and there is nothing to deploy. DataSync would work but needs an agent deployed and configured on premises; Snowball takes days and is meant for far larger data; an IPsec VPN adds setup with no benefit because HTTPS already encrypts."),
    515: (["A", "B", "C"], "Redshift fits: the Redshift Data API, which lets traditional, containerized, serverless and event-driven applications run SQL without drivers or connection management (A); encryption at rest and client-side encryption (B); and running analytics workloads at specified hours when the application is idle (C). Caching (D) is ElastiCache's job. 'Tens of millions of requests per minute' at global scale (E) describes DynamoDB, not a data warehouse. F isn't a Redshift feature."),
    108: (["D"], "The data must reach multiple target systems, which is the SNS fan-out pattern: publish once to an SNS topic that is subscribed to several SQS queues, one per target, and have Lambda functions update each target. Note (debated question): RDS event notifications only fire on operational events (failover, backup, configuration changes), not on row updates such as a car being sold, so in practice the trigger would come from the application. A and B send to a single queue, so only one consumer receives each message. C has SQS and SNS in the wrong order."),
    167: (["C"], "SQS-driven work is a good fit for Spot: if a Spot Instance is interrupted, the message becomes visible again and another instance processes it. Reserved Instances cover the always-on baseline, so processing never stops, and Spot handles the unpredictable bursts at the lowest cost. Note (debated question): some argue for On-Demand bursts (D) because of 'without any downtime', but the RI baseline already keeps processing running. Spot only (A) risks losing all capacity; RIs sized for peak (B) waste money."),
    523: (["A"], "AWS AppSync pipeline resolvers run several resolver functions in sequence in one GraphQL request, so the app can read from multiple DynamoDB tables with no extra servers or custom aggregation code: the most operationally efficient option. Note (debated question): Athena Federated Query (D) can read DynamoDB through a connector, but it is a Lambda-based analytics query path that consumes table read capacity and is not meant for application request traffic. CloudFront with Lambda@Edge or API Gateway with Lambda need custom code to aggregate the tables."),
    540: (["C"], "Flawed question: none of the options is fully valid today. The choices contrast RDS deployment modes, and the only one with readable standby instances for offloading reporting plus Multi-AZ high availability is a Multi-AZ DB cluster (C). However, Multi-AZ DB clusters support only MySQL and PostgreSQL, not Oracle; for RDS for Oracle the real answer is Multi-AZ plus an Oracle read replica. D would require migrating from Oracle to Aurora, a heterogeneous migration, and 'Multi-AZ instance deployment' is not how Aurora is deployed. A spans Regions needlessly; B has no high availability."),
}
FLAWED = {540}
DROP = {477}
TEXT_FIX = [
    ("�", "'"), ("attach it to the VPModify", "attach it to the VPC. Modify"), ("AW'S", "AWS"),
    ("Auto Sealing", "Auto Scaling"), ("multi-Region kays", "multi-Region keys"),
    ("Savings Pian", "Savings Plan"), ("individually bled", "individually billed"),
    # The site dropped "<A-F>. " sequences (it looks like a choice label), gluing words together.
    ("VPConfigure", "VPC. Configure"), ("ALUse", "ALB. Use"), ("VPUpdate", "VPC. Update"),
    ("VPInstruct", "VPC. Instruct"), ("NLProcess", "NLB. Process"), ("Multi-AZAmazon", "Multi-AZ Amazon"),
    ("CPUUtilizalion", "CPUUtilization"), ("Standard-1A", "Standard-IA"), ("payment I", "payment ID."), ("RESTAPI", "REST API"), ("Order a 1 GB dedicated AWS Direct Connect", "Order a 1 Gbps dedicated AWS Direct Connect"), ("incomingtraffic", "incoming traffic"), ("CPUUtilization matric", "CPUUtilization metric"),
    ("Sat each volume’ tiering", "Set each volume’s tiering"), ("fila system", "file system"),
    ("the ‘same every night", "the same every night"), ("application’ s data", "application’s data"), ("cache state files at edge", "cache static files at edge"),
    ("mount target m each", "mount target in each"), ("crossaccount", "cross-account"), ("whenthe", "when the"),
    ("Multi-AZ DB duster", "Multi-AZ DB cluster"), ("web tiers security group", "web tier's security group"),
    ("forms the database layer Amazon ElastiCache", "forms the database layer. Amazon ElastiCache"),
    ("serve a static website The logic tier", "serve a static website. The logic tier"),
    ("function as a file system be mountable", "function as a file system and be mountable"),
    ("every10 minutes", "every 10 minutes"), ("new URL tor restricted", "new URL for restricted"), ("(AWS KMS) Attach the KMS keys", "(AWS KMS). Attach the KMS keys"), ("is not being processed Amazon CloudWatch", "is not being processed. Amazon CloudWatch"),
    ("data by using SL.", "data by using SQL."), ("with the launch template Configure the launch template", "with the launch template. Configure the launch template"), ("DynamoDProvision", "DynamoDB. Provision"),
    ("DynamoDUse", "DynamoDB. Use"), ("anotherAWS", "another AWS"), ("ofAWS", "of AWS"),
    ("ofAmazon", "of Amazon"), ("Еhe company", "The company"),
]

# The site merged two choices into one; split them back (src id -> choices, key).
SPLIT = {
    125: ([
        "Use an Auto Scaling group to launch the EC2 instances in private subnets. Deploy an RDS Multi-AZ DB instance in private subnets.",
        "Configure a VPC with two private subnets and two NAT gateways across two Availability Zones. Deploy an Application Load Balancer in the private subnets.",
        "Use an Auto Scaling group to launch the EC2 instances in public subnets across two Availability Zones. Deploy an RDS Multi-AZ DB instance in private subnets.",
        "Configure a VPC with one public subnet, one private subnet, and two NAT gateways across two Availability Zones. Deploy an Application Load Balancer in the public subnet.",
        "Configure a VPC with two public subnets, two private subnets, and two NAT gateways across two Availability Zones. Deploy an Application Load Balancer in the public subnets.",
    ], ["A", "E"]),
}

CHOICE_END = {(231, "A"): " A.", (231, "B"): " B.", (237, "B"): "-B."}
STEM_END = {232: "Which solution will meet this requirement?", 460: "Which solution will meet these requirements?",
            467: "Which solution will meet these requirements?", 473: "Which solution will meet these requirements?"}

# Sentence breaks the site lost ("...deployment Configure the..."): insert ". ".
VERBS = ("Use|Configure|Create|Deploy|Attach|Set|Enable|Store|Migrate|Launch|Add|Turn|Modify|Update|Schedule|Replace|"
         "Implement|Point|Direct|Copy|Restore|Apply|Increase|Run|Send|Move|Install|Provision|Write|Associate|Assign|Grant|"
         "Allow|Define|Change|Integrate|Invoke|Subscribe|Register|Share|Upload|Encrypt|Purchase|Remove|Delete|Ensure|"
         "Monitor|Publish|Specify|Generate|Retrieve|Optimize")
BREAK = re.compile(r"([A-Za-z0-9]) +((?:" + VERBS + r") +(?:the|a|an|AWS|Amazon|it|each|all|this|that|S3|Lambda|DynamoDB|[A-Z]{2,})\b|(?:A|The) (?:solutions architect|company)\b)")

def clean(s):
    for a, b in TEXT_FIX:
        s = s.replace(a, b)
    s = re.sub(r"\n\s*\.\s*\n", "\n", s)      # lone "." lines
    s = BREAK.sub(r"\1. \2", s)
    return s

src = json.load(open(SRC, encoding="utf-8"))
out = []
for q in src:
    if q["id"] in DROP:
        continue
    q = json.loads(json.dumps(q))
    q["question"] = clean(q["question"])
    for c in q["choices"]:
        c["text"] = clean(c["text"])
        # Same stripping at the end of a choice: "...in a VP" was "...in a VPC."
        c["text"] = re.sub(r"\b(VP|DynamoD|NL|AL)$", lambda m: {"VP": "VPC.", "DynamoD": "DynamoDB.", "NL": "NLB.", "AL": "ALB."}[m[1]], c["text"].rstrip())
    q["explanation"] = clean(q["explanation"])
    # Choices / stems the site cut ("<A-F>." stripped at the very end, or the question line lost).
    for (sid, letter), text in CHOICE_END.items():
        if q["id"] == sid:
            c = next(c for c in q["choices"] if c["letter"] == letter)
            c["text"] = c["text"].rstrip() + text
    if q["id"] in STEM_END:
        q["question"] = q["question"].rstrip() + "\n" + STEM_END[q["id"]]
    if str(q["id"]) in POL:
        # Exhibit goes where the image was: after the line that introduces it
        # (Q253: after line 1), before the actual question sentence otherwise.
        lines = q["question"].split("\n")
        at = 1 if q["id"] == 253 else len(lines) - 1
        ex = POL[str(q["id"])]
        lines.insert(at, "\n" + ex + "\n")
        q["question"] = "\n".join(lines)
    if q["id"] in KEY:
        new, expl = KEY[q["id"]]
        q["siteCorrect"] = q["correct"]
        q["correct"] = new
        q["explanation"] = expl
    if q["id"] in SPLIT:
        texts, key = SPLIT[q["id"]]
        q["choices"] = [{"letter": "ABCDEF"[i], "text": t} for i, t in enumerate(texts)]
        q["siteCorrect"] = q["correct"]
        q["correct"] = key
        q["explanation"] = ("Run the EC2 instances in private subnets behind an ALB, with an RDS Multi-AZ DB instance in private subnets (A), "
            "in a VPC with two public and two private subnets across two AZs, a NAT gateway in each AZ and the ALB in the public subnets (E). "
            "The instances stay off the public internet but reach the payment service through the NAT gateways, and every tier spans two AZs. "
            "An ALB in private subnets can't receive internet traffic (B); instances in public subnets are exposed (C); "
            "one public and one private subnet can't span two AZs for each tier (D). "
            "(The source site had merged choices D and E into one; they are split back here.)")
    q["type"] = "multi" if len(q["correct"]) > 1 else "single"
    q["multi"] = q["type"] == "multi"
    if q["id"] in FLAWED:
        q["flawed"] = True
    out.append(q)

json.dump(out, open(OUT, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
OUT.write_text(OUT.read_text(encoding="utf-8") + "\n", encoding="utf-8")
left = sum("�" in json.dumps(q, ensure_ascii=False) for q in out)
print(f"wrote {len(out)} questions, {sum('siteCorrect' in q for q in out)} keys changed, {left} with leftover U+FFFD")
