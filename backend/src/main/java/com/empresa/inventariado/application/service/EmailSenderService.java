package com.empresa.inventariado.application.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Async;

@Service
public class EmailSenderService {

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void enviarmensaje(String Email, String subject, String body) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("marcoarias765@gmail.com");

        message.setTo(Email);
        message.setText(body);
        message.setSubject(subject);

        mailSender.send(message);

        System.out.print("email enviado");
    }

}
