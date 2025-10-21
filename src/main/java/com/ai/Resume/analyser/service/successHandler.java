package com.ai.Resume.analyser.service;

import com.ai.Resume.analyser.jwt.jwtService;
import com.ai.Resume.analyser.model.usersTable;
import com.ai.Resume.analyser.repository.usersTableRepo;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;


@Component
public class successHandler implements AuthenticationSuccessHandler {


    @Autowired
    private usersTableRepo usersTableRepository;

    @Autowired
    private jwtService jwtService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String,Object> userdata = oAuth2User.getAttributes();

        String email = userdata.get("email").toString();
        String name = userdata.get("name").toString();

        if (! usersTableRepository.existsById(email)){
            usersTable newUser= usersTable.builder()
                    .username(name)
                    .email(email)
                    .password("")
                    .resetExpiration(null)
                    .previousResults(false)
                    .resetOtp(null)
                    .build();
            usersTableRepository.save(newUser);
        }

        String token = jwtService.generateToken(email);
        ResponseCookie cookie = ResponseCookie.from("entrypasstoken",token).path("/").httpOnly(true).maxAge(20*24*60*60).sameSite("Strict").secure(false).build();
        response.addHeader("Set-Cookie",cookie.toString());
        response.sendRedirect("/");



    }
}
