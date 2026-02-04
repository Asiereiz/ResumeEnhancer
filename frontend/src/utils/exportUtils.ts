import { jsPDF } from "jspdf";
import { ResumeResult } from "@/types";

export const exportPDF = (result: ResumeResult | null) => {
    if (!result) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const maxLineWidth = pageWidth - margin * 2;

    // Title
    doc.setFontSize(16);
    doc.text("Enhanced Resume", margin, 20);

    // Enhanced Text
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(result.enhanced_text || "", maxLineWidth);
    doc.text(splitText, margin, 35);

    // Add some spacing after text
    let yPos = 35 + (splitText.length * 5) + 10;

    // Bullet Points
    if (result.bullet_points && result.bullet_points.length > 0) {
        if (yPos > 250) { // Check if we need a new page
            doc.addPage();
            yPos = 20;
        }

        doc.setFontSize(14);
        doc.text("Improved Bullet Points", margin, yPos);
        yPos += 10;

        doc.setFontSize(12);
        result.bullet_points.forEach((bullet: string) => {
            const bulletText = `• ${bullet}`;
            const splitBullet = doc.splitTextToSize(bulletText, maxLineWidth);

            if (yPos + (splitBullet.length * 5) > 280) {
                doc.addPage();
                yPos = 20;
            }

            doc.text(splitBullet, margin, yPos);
            yPos += (splitBullet.length * 5) + 2;
        });
    }

    doc.save("resume.pdf");
};

export const exportDOCX = (result: ResumeResult | null) => {
    if (!result) return;
    const textContent = result.enhanced_text || JSON.stringify(result, null, 2);
    const blob = new Blob(
        [
            `<html xmlns:w="urn:schemas-microsoft-com:office:word">
      <head><meta charset="utf-8"></head>
      <body>${textContent}</body>
    </html>`,
        ],
        { type: "application/msword" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.docx";
    a.click();
    URL.revokeObjectURL(url);
};

export const exportJSON = (result: ResumeResult | null) => {
    if (!result) return;

    const jsonContent = JSON.stringify({
        corrected_text: result.enhanced_text || "",
        improved_bullets: result.bullet_points || [],
        ats_score: result.ats_score || 0,
        strengths: result.strengths || [],
        suggestions: result.suggestions || []
    }, null, 2);

    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume_data.json";
    a.click();
    URL.revokeObjectURL(url);
};
