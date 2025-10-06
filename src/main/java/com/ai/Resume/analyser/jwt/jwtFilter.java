package com.ai.Resume.analyser.jwt;

import com.ai.Resume.analyser.configuration.entryPointService;
import com.ai.Resume.analyser.model.usersTable;
import com.ai.Resume.analyser.repository.usersTableRepo;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


@Service
public class jwtFilter extends OncePerRequestFilter {

    @Autowired
    private entryPointService entryService;

    @Autowired
    private usersTableRepo usersTableRepository;

    @Autowired
    private jwtService jwtservice;



    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String token = null;
        usersTable user = null;
        String reqUri=request.getRequestURI();
        if(reqUri.startsWith("/resumeAnalyser/entry/v1") || reqUri.equals("/") || reqUri.equals("/login") || reqUri.equals("/forgotpassword")){
            filterChain.doFilter(request,response);
            return;
        }

        Cookie[] cookies = request.getCookies();
        if(cookies != null){
            for(Cookie cookie:cookies ){
                if (cookie.getName().equals("entrypasstoken")){
                    token=cookie.getValue();
                    break;
                }
            }
        }

        if(token != null){
            user = usersTableRepository.findById(jwtservice.getEmail(token)).orElse(null);
        }

        if(token != null && user != null && SecurityContextHolder.getContext().getAuthentication()==null){
            if(jwtservice.validateToken(token,user.getEmail())){
                User user1 = (User) entryService.loadUserByUsername(user.getEmail());
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(user1,null,user1.getAuthorities());
                usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);


            }

        }


        filterChain.doFilter(request,response);
    }
}
