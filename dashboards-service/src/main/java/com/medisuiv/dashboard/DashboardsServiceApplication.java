package com.medisuiv.dashboard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients
@SpringBootApplication
public class DashboardsServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(DashboardsServiceApplication.class, args);
    }
}
