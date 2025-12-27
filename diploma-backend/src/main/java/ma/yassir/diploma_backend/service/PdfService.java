package ma.yassir.diploma_backend.service;

import com.itextpdf.barcodes.BarcodeQRCode;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.xobject.PdfFormXObject;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.properties.TextAlignment;
import ma.yassir.diploma_backend.entity.Diploma;
import ma.yassir.diploma_backend.entity.Student;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;

@Service
public class PdfService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    // URL de votre Frontend React (Vite par défaut tourne sur le port 5173)
    private static final String FRONTEND_URL = "http://localhost:5173";


    /**
     * Génère le fichier PDF du diplôme.
     * @param student L'étudiant concerné
     * @param diploma Les infos du diplôme (Année, Spécialité)
     * @return Le chemin complet du fichier généré
     */
    public String generateDiplomaPdf(Student student, Diploma diploma) throws IOException {

        // 1. Créer le dossier de stockage s'il n'existe pas
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // 2. Définir le nom du fichier (Ex: CNE_Specialite.pdf)
        String fileName = student.getCne() + "_" + diploma.getSpeciality().replaceAll("\\s+", "_") + ".pdf";
        String filePath = uploadPath.resolve(fileName).toString();

        // 3. Initialiser iText pour écrire le PDF
        PdfWriter writer = new PdfWriter(filePath);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf, PageSize.A4.rotate()); // Format Paysage (Landscape)

        // 4. Ajouter le contenu visuel (Design simple pour le prototype)

        // -- Titre de l'école
        Paragraph schoolName = new Paragraph("ENSIASD - Taroudant")
                .setFontSize(24)
                .setBold()
                .setFontColor(ColorConstants.BLUE)
                .setTextAlignment(TextAlignment.CENTER);
        document.add(schoolName);

        // -- Titre du document
        document.add(new Paragraph("\n\nATTESTATION DE DIPLÔME")
                .setFontSize(30)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER));

        // -- Corps du texte
        Paragraph body = new Paragraph()
                .add(new Text("\n\nNous certifions que l'étudiant(e) "))
                .add(new Text(student.getFirstName() + " " + student.getLastName().toUpperCase()).setBold())
                .add(new Text("\nNé(e) le : " + student.getBirthDate()))
                .add(new Text("\nCode National (CNE) : " + student.getCne()))
                .add(new Text("\n\nA validé avec succès les examens nécessaires à l'obtention du diplôme de :"))
                .setFontSize(14)
                .setTextAlignment(TextAlignment.CENTER);
        document.add(body);

        // -- Spécialité
        Paragraph speciality = new Paragraph(diploma.getSpeciality())
                .setFontSize(20)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(20);
        document.add(speciality);

        document.add(new Paragraph("Promotion : " + diploma.getGraduationYear())
                .setTextAlignment(TextAlignment.CENTER));

        // 5. Générer le QR Code de vérification
        // Ce QR Code pointera vers votre site public pour vérifier le Hash
        // Note: Le lien exact dépendra du Hash final, ici on met un lien temporaire ou l'ID
        // Dans une V2, on génère le QR après avoir calculé le Hash (processus en 2 temps),
        // mais pour simplifier ici, on encode l'URL de vérification basée sur l'ID futur (ou le CNE).
        // Générer le QR Code (CORRECTIF ICI)
        // On pointe vers le site React avec l'ID unique du diplôme
        String verificationUrl = FRONTEND_URL + "/verify/" + diploma.getId();


        BarcodeQRCode qrCode = new BarcodeQRCode(verificationUrl);
        PdfFormXObject qrCodeObject = qrCode.createFormXObject(ColorConstants.BLACK, pdf);
        Image qrCodeImage = new Image(qrCodeObject)
                .setWidth(100)
                .setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.CENTER);
        document.add(new Paragraph("\nScannez pour vérifier l'authenticité :").setTextAlignment(TextAlignment.CENTER).setFontSize(10));
        document.add(qrCodeImage);

        // 6. Fermer le document
        document.close();
        System.out.println("📄 PDF généré avec succès : " + filePath);

        return filePath;
    }

    /**
     * Calcule le Hash SHA-256 du fichier PDF généré.
     * C'est ce Hash qui sera stocké sur la Blockchain pour garantir l'intégrité.
     */
    public String calculatePdfHash(String filePath) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        FileInputStream fis = new FileInputStream(new File(filePath));

        byte[] byteArray = new byte[1024];
        int bytesCount;

        while ((bytesCount = fis.read(byteArray)) != -1) {
            digest.update(byteArray, 0, bytesCount);
        }
        fis.close();

        byte[] bytes = digest.digest();

        // Convertir les bytes en format Hexadécimal (String)
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }

        // Ajouter le préfixe "0x" requis par Solidity/Web3j
        return "0x" + sb.toString();
    }
    // Dans PdfService.java

    public String calculateHashFromStream(java.io.InputStream inputStream) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] byteArray = new byte[1024];
        int bytesCount;

        while ((bytesCount = inputStream.read(byteArray)) != -1) {
            digest.update(byteArray, 0, bytesCount);
        }

        byte[] bytes = digest.digest();
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return "0x" + sb.toString(); // Format compatible Solidity
    }
}