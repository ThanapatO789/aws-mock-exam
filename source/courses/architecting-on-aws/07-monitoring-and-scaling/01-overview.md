# Overview

โมดูลนี้ครอบคลุมวิธีการ monitor และ log กิจกรรมใน AWS accounts และวิธีการ scale แอปพลิเคชันตามความต้องการที่เปลี่ยนแปลงไป

ในโมดูลนี้ ผู้เรียนจะได้เรียนรู้วิธี:

- ระบุเครื่องมือและบริการที่ใช้สำหรับ monitoring และ logging
- ตั้งค่า thresholds และ alerts เมื่อมีการเปลี่ยนแปลงใน infrastructure
- ใช้ load balancer เพื่อกระจาย incoming application traffic ไปยัง targets หลายตัว เพื่อเพิ่มความพร้อมใช้งาน (availability) ของแอปพลิเคชัน
- เปรียบเทียบคุณสมบัติของ auto scaling เพื่อกำหนด best practices

## Key terms
- Monitoring: การเฝ้าติดตามสถานะและประสิทธิภาพของทรัพยากรใน AWS
- Load balancer: บริการที่กระจาย traffic ไปยัง target หลายตัวเพื่อเพิ่ม availability
- Auto Scaling: การปรับขนาดทรัพยากรอัตโนมัติตามความต้องการ
