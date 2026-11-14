Q221 | D | high |
Q222 | A | high |
Q223 | A,D | high |
Q224 | C,E | high |
Q225 | A | med | A vs B: data stream needs Firehose to reach S3; S3+Athena vs Redshift cluster for petabytes
Q226 | A,E | high |
Q227 | B | high |
Q228 | C | high |
Q229 | A | high |
Q230 | C | high |
Q231 | B | high |
Q232 | C | med | no question stem; C (flow logs + metric filter on 22/3389) vs A (Application Insights does not detect RDP/SSH)
Q233 | A,B | high |
Q234 | C | high |
Q235 | C | high |
Q236 | D | high |
Q237 | A | high |
Q238 | C | high |
Q239 | B | med | B (Lambda function URL with AWS_IAM, simplest) vs A (API Gateway REST API with IAM auth, older key)
Q240 | D | high |
Q241 | C | high |
Q242 | C | high |
Q243 | A | high |
Q244 | C | high |
Q245 | D | high |
Q246 | D | high |
Q247 | C,E | high |
Q248 | D | high |
Q249 | D | high |
Q250 | D | high |
Q251 | B | high |
Q252 | A | high |
Q253 | C | low | policy documents missing from the question; cannot evaluate Policy1/Policy2
Q254 | B | high |
Q255 | D | high |
Q256 | B,D | high |
Q257 | A | high |
Q258 | D | high |
Q259 | A | high |
Q260 | D | high |
Q261 | A,C | high |
Q262 | A | high |
Q263 | A,D | high |
Q264 | D | high |
Q265 | C | high |
Q266 | A | high |
Q267 | D | high |
Q268 | A | high |
Q269 | C | high |
Q270 | A | high |
Q271 | C | high |
Q272 | B | high |
Q273 | B | high |
Q274 | B | high |
Q275 | A | high |
Q276 | A,D | high |
Q277 | D | med | D (S3 + temporary EBS) is cheapest but awkward for multi-instance processing; others clearly worse
Q278 | B,E | high |
Q279 | A | high |
Q280 | B | high |
Q281 | A | high |
Q282 | B | high |
Q283 | D | high |
Q284 | B | med | B (Cost Explorer) vs A (Athena on CUR); "by user" needs tags/CUR either way
Q285 | B | high |
Q286 | C | high |
Q287 | B | high |
Q288 | C | high |
Q289 | B | high |
Q290 | C | high |
Q291 | A,B | high |
Q292 | A,B | high |
Q293 | D | high |
Q294 | B | high |
Q295 | B | high |
Q296 | D | high |
Q297 | B | high |
Q298 | C | high |
Q299 | B | high |
Q300 | C | high |
Q301 | C | high |
Q302 | A,C | low | header says [pick 1] but stem says choose two; A,C are the two correct choices
Q303 | D | high |
Q304 | A | high |
Q305 | C | high |
Q306 | A | high |
Q307 | D | high |
Q308 | B,C | med | B vs A: RI optimization check is meaningful from the consolidated billing (payer) account
Q309 | A | high |
Q310 | B | high |
Q311 | C | high |
Q312 | B | high |
Q313 | C | high |
Q314 | B | high |
Q315 | D | high |
Q316 | C | high |
Q317 | A | high |
Q318 | A,D | high |
Q319 | A | high |
Q320 | A | med | A (KDS + KDA SQL) vs B (Firehose to Redshift, buffering adds latency)
Q321 | D | high |
Q322 | C | med | C (SQS async, immediate ack) vs D (SNS fan-out with push notification)
Q323 | B | high |
Q324 | D | high |
Q325 | A | high |
Q326 | A,B | high |
Q327 | A | high |
Q328 | D | med | D (SQS buffering guarantees processing) vs B (CloudFront + ASG on network traffic)
Q329 | D | high |
Q330 | A | high |
