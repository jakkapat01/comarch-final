# ComArch — FE2019b Study Guide

เว็บภาษาไทยสอนสถาปัตยกรรมคอมพิวเตอร์จากพื้นฐาน อ้างอิงข้อสอบ FE2019b วิชา 198322

- บทเรียน 8 บท ครอบคลุมข้อสอบทั้ง 6 ข้อ
- เฉลยและเหตุผลของตาราง arithmetic, ALU และ main control
- ทดลองบวก 4 บิต, logical shift และ pipeline timeline
- แบบฝึก 12 ข้อพร้อมคำอธิบาย และบันทึกความคืบหน้าในเบราว์เซอร์
- ไม่มี dependencies, tracking หรือ backend

เปิด `index.html` ได้โดยตรง หรือให้บริการด้วย static HTTP server

## GitHub Pages

อัปโหลด index.html, style.css, content.js, app.js และ .nojekyll ไปที่ root ของ branch main จากนั้น Settings → Pages → Deploy from a branch → main → / (root) → Save

เอกสารทางการ: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## ขอบเขตเนื้อหา

เป็นเฉลยที่เรียบเรียงขึ้น ไม่ใช่เฉลยทางการ ข้อ 3 ยึด datapath 3 สถานะตามโจทย์ ข้อ 5.1 แสดงทั้งกรณียึด 1 GHz และยึด 1 μs เพราะต้นฉบับระบุหน่วยขัดกัน ข้อ 5.10 อธิบายความต่างระหว่างลด memory latency กับแยก instruction/data cache เพื่อแก้การแย่งพอร์ต

PDF ต้นฉบับไม่ได้รวมใน repository เนื้อหาคำอธิบายจัดทำใหม่โดยอ้างอิงเลขข้อและตารางสำหรับการทบทวน
