package ma.yassir.diploma_backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String sender;

    public void sendDiplomaEmail(String to, String studentName, String major, String pdfPath) {
        try {
            // Création d'un message complexe (MimeMessage) pour accepter les pièces jointes
            MimeMessage message = mailSender.createMimeMessage();

            // "true" signifie qu'on attache des fichiers (Multipart)
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(sender);
            helper.setTo(to);
            helper.setSubject("🎓 Félicitations ! Votre Diplôme Certifié est prêt");

            // Corps du message en HTML (pour faire joli)
            String htmlBody = "<h3>Bonjour " + studentName + ",</h3>"
                    + "<p>Félicitations pour l'obtention de votre diplôme en <strong>" + major + "</strong> !</p>"
                    + "<p>Votre document a été certifié sur la Blockchain et est infalsifiable.</p>"
                    + "<p>Veuillez trouver votre diplôme original (PDF) en pièce jointe.</p>"
                    + "<br/><p>Cordialement,<br/>L'équipe de Certification ENSIAS</p>";

            helper.setText(htmlBody, true); // true = HTML

            // Ajout de la pièce jointe (Le PDF)
            FileSystemResource file = new FileSystemResource(new File(pdfPath));
            if (file.exists()) {
                helper.addAttachment("Diplome_Certifie.pdf", file);
            }

            mailSender.send(message);
            System.out.println("📧 Email envoyé avec succès à : " + to);

        } catch (MessagingException e) {
            System.err.println("❌ Erreur lors de l'envoi de l'email : " + e.getMessage());
        }
    }
}