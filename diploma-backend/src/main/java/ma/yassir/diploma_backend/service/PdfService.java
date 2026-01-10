package ma.yassir.diploma_backend.service;

import com.itextpdf.barcodes.BarcodeQRCode;
import com.itextpdf.io.font.constants.StandardFonts; // Pour Times New Roman
import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb; // Pour les couleurs précises (Or/Bleu roi)
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.xobject.PdfFormXObject;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.VerticalAlignment;
import ma.yassir.diploma_backend.controller.DiplomaController;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.web3j.utils.Numeric;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private static final String FRONTEND_URL = "http://localhost:5173";

    public String generateDiplomaPdf(DiplomaController.DiplomaRequestDTO request) throws IOException {

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

        String fileName = request.cne + "_" + request.major.replaceAll("\\s+", "_") + ".pdf";
        String filePath = uploadPath.resolve(fileName).toString();

        PdfWriter writer = new PdfWriter(filePath);
        PdfDocument pdf = new PdfDocument(writer);
        // Format A4 Paysage
        Document document = new Document(pdf, PageSize.A4.rotate());

        // Marges adaptées pour le cadre
        document.setMargins(40, 50, 40, 50);

        // --- 0. POLICES & COULEURS ---
        PdfFont fontNormal = PdfFontFactory.createFont(StandardFonts.TIMES_ROMAN);
        PdfFont fontBold = PdfFontFactory.createFont(StandardFonts.TIMES_BOLD);
        // Bleu Roi officiel (semblable aux diplômes)
        DeviceRgb royalBlue = new DeviceRgb(0, 51, 102);
        // Couleur Or pour le titre
        DeviceRgb goldColor = new DeviceRgb(184, 134, 11);

        // --- 1. ARRIÈRE-PLAN (CADRE / BACKGROUND) ---
        try {
            ClassPathResource bgResource = new ClassPathResource("background.jpg");
            if (bgResource.exists()) {
                Image bg = new Image(ImageDataFactory.create(bgResource.getURL()));
                // On fixe l'image pour qu'elle couvre TOUTE la page (0,0)
                bg.setFixedPosition(0, 0);
                bg.scaleAbsolute(PageSize.A4.rotate().getWidth(), PageSize.A4.rotate().getHeight());
                document.add(bg);
            }
        } catch (Exception e) { /* Ignorer si pas d'image */ }

        // --- 2. EN-TÊTE OFFICIEL (ROYAUME DU MAROC) ---
        // On place l'emblème au centre en haut
        try {
            ClassPathResource emblemResource = new ClassPathResource("coat_of_arms.png");
            if (emblemResource.exists()) {
                Image emblem = new Image(ImageDataFactory.create(emblemResource.getURL()));
                emblem.scaleToFit(50, 50);
                emblem.setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.CENTER);
                document.add(emblem);
            }
        } catch (Exception e) { }

        // Texte En-tête
        Paragraph header = new Paragraph()
                .add(new Text("ROYAUME DU MAROC\n").setFont(fontBold).setFontSize(10))
                .add(new Text("MINISTÈRE DE L'ENSEIGNEMENT SUPÉRIEUR,\nDE LA RECHERCHE SCIENTIFIQUE ET DE L'INNOVATION\n").setFont(fontNormal).setFontSize(8))
                .add(new Text("UNIVERSITÉ IBN ZOHR\n").setFont(fontBold).setFontSize(10))
                .add(new Text("ÉCOLE NATIONALE DES SCIENCES APPLIQUÉES").setFont(fontBold).setFontSize(10)) // Remplace ENSIASD
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(ColorConstants.BLACK)
                .setMarginBottom(10);
        document.add(header);

        // --- 3. TITRE DU DIPLÔME ---
        document.add(new Paragraph("DIPLÔME D'INGÉNIEUR D'ÉTAT")
                .setFont(fontBold)
                .setFontSize(24)
                .setFontColor(goldColor) // Couleur Or/Doré
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(10)
                .setMarginBottom(20));

        // --- 4. CORPS DU TEXTE (FORMULATION OFFICIELLE) ---

        Paragraph body = new Paragraph()
                .setTextAlignment(TextAlignment.CENTER)
                .setMultipliedLeading(1.5f); // Espacement des lignes élégant

        body.add(new Text("Le Président de l'Université, sur proposition du Directeur de l'École,\n").setFont(fontNormal).setFontSize(12));
        body.add(new Text("atteste que :\n").setFont(fontNormal).setFontSize(12));

        // Nom de l'étudiant en TRÈS GRAND
        body.add(new Text(request.firstName + " " + request.lastName.toUpperCase() + "\n").setFont(fontBold).setFontSize(26).setFontColor(royalBlue));

        // Infos détaillées
        body.add(new Text("Né(e) le : " + formatDate(request.birthDate) + "       ").setFont(fontNormal).setFontSize(12));
        body.add(new Text("CNI : " + request.cni + "       ").setFont(fontNormal).setFontSize(12));
        body.add(new Text("CNE : " + request.cne + "\n").setFont(fontNormal).setFontSize(12));

        body.add(new Text("A obtenu le Diplôme d'Ingénieur d'État en :\n").setFont(fontNormal).setFontSize(14));
        body.add(new Text(request.major.toUpperCase() + "\n").setFont(fontBold).setFontSize(18));
        body.add(new Text("(Promotion " + request.graduationYear + ")").setFont(fontNormal).setFontSize(12));

        document.add(body);

        // --- 5. BAS DE PAGE (LIEU, DATE, SIGNATURE, QR) ---

        // Espace flexible
        document.add(new Paragraph("\n"));

        // Date dynamique
        String currentDate = LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));

        // Conteneur pour signature et date
        Paragraph footer = new Paragraph()
                .add(new Text("Fait à Taroudant, le " + currentDate + "\n").setFont(fontNormal).setFontSize(12))
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(20);

        // Signature (Texte)
        footer.add(new Text("Le Président de l'Université                                        Le Directeur de l'École").setFont(fontBold).setFontSize(11));
        document.add(footer);

        // QR CODE (Placé discrètement en bas au centre)
        String verificationUrl = FRONTEND_URL + "/verify/" + request.cne;
        BarcodeQRCode qrCode = new BarcodeQRCode(verificationUrl);
        PdfFormXObject qrCodeObject = qrCode.createFormXObject(ColorConstants.BLACK, pdf);
        Image qrCodeImage = new Image(qrCodeObject).setWidth(70).setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.CENTER);

        document.add(qrCodeImage);
        document.add(new Paragraph("Réf Blockchain: " + request.cne).setFontSize(6).setTextAlignment(TextAlignment.CENTER).setFontColor(ColorConstants.GRAY));

        document.close();
        return filePath;
    }

    // Petit utilitaire pour formater la date proprement
    private String formatDate(String dateStr) {
        if(dateStr == null || dateStr.isEmpty()) return "Non renseigné";
        try {
            LocalDate date = LocalDate.parse(dateStr);
            return date.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        } catch (Exception e) {
            return dateStr;
        }
    }

    // --- HASHING METHODS CORRIGÉES ---

    // Utilisé lors de la CRÉATION (Lecture fichier disque)
    public byte[] calculatePdfHashBytes(String filePath) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        FileInputStream fis = new FileInputStream(new File(filePath));
        byte[] byteArray = new byte[1024];
        int bytesCount;
        while ((bytesCount = fis.read(byteArray)) != -1) digest.update(byteArray, 0, bytesCount);
        fis.close();
        return digest.digest();
    }

    // Utilisé lors de la VÉRIFICATION (Lecture fichier uploadé)
    public String calculateHashFromStream(InputStream inputStream) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] byteArray = new byte[1024];
        int bytesCount;
        while ((bytesCount = inputStream.read(byteArray)) != -1) {
            digest.update(byteArray, 0, bytesCount);
        }
        byte[] bytes = digest.digest();

        // --- CORRECTION : Utilisation de Web3j ---
        return Numeric.toHexString(bytes);
    }
}