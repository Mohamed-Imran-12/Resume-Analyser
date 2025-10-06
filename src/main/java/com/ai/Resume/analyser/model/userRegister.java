package com.ai.Resume.analyser.model;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor


public class userRegister {

    @NotBlank(message = "username must not be empty")
    private String username;

    @Id
    @Email(message = "enter a valid email")
    @NotBlank(message = "email must not be empty")
    private String email;

    @Size( min = 6  ,max = 16 , message = "password atLeast have 6 characters and atMax of 16 characters")
    private String  password;

    @Size(min = 6, max = 6, message = "OTP must be 6 characters")
    @NotBlank(message = "OTP must not be empty")
    private String verifyotp;

}
