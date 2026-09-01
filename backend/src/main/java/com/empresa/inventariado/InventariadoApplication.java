package com.empresa.inventariado;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class InventariadoApplication {

	public static void main(String[] args) {
		SpringApplication.run(InventariadoApplication.class, args);
	}

}
