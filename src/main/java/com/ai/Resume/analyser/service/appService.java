package com.ai.Resume.analyser.service;


import com.ai.Resume.analyser.model.loginResponse;
import com.ai.Resume.analyser.model.previousTable;
import com.ai.Resume.analyser.model.resultsDto;
import com.ai.Resume.analyser.model.usersTable;
import com.ai.Resume.analyser.repository.prevTable;
import com.ai.Resume.analyser.repository.usersTableRepo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;
import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;

@Service
public class appService {

    @Value("${genKey}")
    private String genKey ;

    @Autowired
    private prevTable previousTableRepo;

    @Autowired
    private usersTableRepo usersTableRepository;

    public ResponseEntity<?> extract(String roles, MultipartFile file) throws TikaException, IOException, InterruptedException {

        Tika tika = new Tika();
        ByteArrayInputStream inpfile = new ByteArrayInputStream(file.getBytes());
        String extracted = tika.parseToString(inpfile);

        String results=null;
        Client client =  Client.builder().apiKey(genKey).build();
        Content content= Content.builder().parts(Part.fromText(extracted), Part.fromText(  "You are now an advanced enterprise-grade ATS resume checker. Your task is to analyze the given resume strictly based on industry-level ATS standards and evaluate it for the specified roles. The evaluation should be moderate to strict (not lenient). A resume should only receive a score between 90 and 100 if it is nearly perfect across all aspects and the content is highly relevant to the specified roles. If any section content is irrelevant to the role, give zero points for that section.\n" +
                "\nBefore analyzing, ensure the roles and resume content match each other and that the resume content is actual content of a real resume (refer: 1. rules and instructions). If it is unrelated, simply treat it as irrelevant content and follow the instructions for irrelevant content. " +
                "Analyze this resume for roles: " + roles + "\n" +
                "Resume Content:\n"  +
                "\n" +
                "Rules and Instructions:\n" +
                "1. Evaluation Categories and Score Allocation (Total 100 points, conditional on role relevance):\n" +
                "- Contact Information (name, email, phone, LinkedIn/GitHub) – 15 points (always scored if present)\n" +
                "- Professional Summary / Objective – 10 points (only score if aligned with role)\n" +
                "- Skills (hard skills, tools, technologies) – 7 points (zero if skills not relevant to role)\n" +
                "- Education (degree, college, graduation year) – 10 points (score only if relevant for role)\n" +
                "- Achievements / Projects (relevant and measurable) – 15 points (zero if not relevant to role)\n" +
                "- Keywords / ATS readiness – 10 points (score only for role-relevant keywords)\n" +
                "- Formatting / Presentation – 5 points (always scored if well formatted)\n" +
                "- No grammatical or spelling mistakes (deduct 5 points if any) – 10 points\n" +
                "- Basic resume evaluation (must meet ATS parsing requirements) – 10 points (score only if structured properly for role content)\n" +
                "- Professional structure and proper layout – 5 points (always scored if proper layout)\n" +
                "- Skills matched with roles – 8 points (zero if skills do not match role)\n" +
                "\n" +
                "2. ATS Optimization Score (0-100):\n" +
                "- Score separately based on ATS parsing readiness, keyword usage, readability, section clarity, lack of graphics/tables, content relevance, and alignment with target role.\n" +
                "- If resume contains irrelevant content for the role, give 0 for the atsoptimizationscore.\n" +
                "\n" +
                "3. Scoring Philosophy:\n" +
                "- Be strict with scoring.\n" +
                "- A resume should only score 90–100 if nearly flawless and fully relevant to the role.\n" +
                "- If any section content is irrelevant to the role, assign zero points for that section.\n" +
                "- 50–89 → Resume is partially relevant but may lack keywords, formatting, or role alignment.\n" +
                "- Below 50 → Resume has significant relevance or ATS issues.\n" +
                "\n" +
                "4. Evaluation Criteria (industrial ATS rules, all relevance-dependent):\n" +
                "- Proper headings: Contact Information, Summary, Skills, Education, Experience, Projects, Achievements.\n" +
                "- Bullet points for readability.\n" +
                "- No images, graphics, or tables that disrupt ATS parsing.\n" +
                "- Chronological or functional structure.\n" +
                "- Action-oriented language in achievements.\n" +
                "- Only include role-relevant keywords; irrelevant keywords give zero points.\n" +
                "- Balanced hard skills (technical) and soft skills relevant to role.\n" +
                "- Professional formatting: consistent fonts, bold section titles, simple layout.\n" +
                "- Concise, measurable content; no long irrelevant descriptions.\n" +
                "- No spelling or grammar mistakes.\n" +
                "- Education and work history clearly structured with dates and relevant to role.\n" +
                "\n" +
                "5. Irrelevant content:\n" +
                "- If the resume is completely irrelevant to the role, return score and atsoptimizationscore as 0, and empty arrays for pros, cons, and suggestions.\n" +
                "\n" +
                "6. Output Format:\n" +
                "Return strict raw JSON only (alphanumeric only, no symbols, no commentary). Response structure:\n" +
                "{\n" +
                "  \"score\": number,\n" +
                "  \"atsoptimizationscore\": number,\n" +
                "  \"pros\": [array of strings](String length <275(chars)),\n" +
                "  \"cons\": [array of strings](String length <275(chars)),\n" +
                "  \"suggestions\": [array of strings](String length <275(chars))\n" +
                "}\n"

        )).build();
        while (true){
            try{
                GenerateContentResponse response = client.models.generateContent("gemini-2.5-flash",content, GenerateContentConfig.builder().temperature(0.0f).build());
                results = response.text();
                break;
            } catch (Exception e) {
                Thread.sleep(1500);
                System.out.println(e);
            }
        }
        if ( results.startsWith("```")) {
            int firstBrace =  results.indexOf("{");
            int lastBrace =  results.lastIndexOf("}");
            if (firstBrace != -1 && lastBrace != -1) {
                results =  results.substring(firstBrace, lastBrace + 1);
            }
        }

        ObjectMapper objectMapper = new ObjectMapper();
        resultsDto  resultsDto = objectMapper.readValue(results, resultsDto.class);
        if(resultsDto.getScore() !=0){
            String uname=SecurityContextHolder.getContext().getAuthentication().getName();
            previousTable processedData = new previousTable(uname,resultsDto.getScore(),resultsDto.getAtsoptimizationscore(),resultsDto.getPros(),resultsDto.getCons(),resultsDto.getSuggestions());
            previousTableRepo.save(processedData);
            usersTable usermod = usersTableRepository.findById(uname).orElse(null);
            if(usermod != null){
                usermod.setPreviousResults(true);
                usersTableRepository.save(usermod);
            }
            return  new ResponseEntity<>("Analysed successfully", HttpStatus.OK);
        }

        return  new ResponseEntity<>("Invalid document", HttpStatus.NOT_ACCEPTABLE);


    }

    public ResponseEntity<?> lastReport() {
        previousTable previousTable = previousTableRepo.findById(SecurityContextHolder.getContext().getAuthentication().getName()).orElse(null);
        if(previousTable != null){
            resultsDto resultsDto = new resultsDto(previousTable.getScore(),previousTable.getAtsoptimizationscore(),previousTable.getPros(),previousTable.getCons(),previousTable.getSuggestions());
            return  new ResponseEntity<>(resultsDto,HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>("No previous Analysis",HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<?> logout() {
        HttpHeaders headers = new HttpHeaders();
        ResponseCookie cookie = ResponseCookie.from("entrypasstoken","").httpOnly(true).secure(false).sameSite("Strict").maxAge(0).path("/").build();
        headers.add(HttpHeaders.SET_COOKIE,cookie.toString());
        return new ResponseEntity<>("Successfully loggedOut",headers,HttpStatus.OK);
    }

    public ResponseEntity<?> deleteAccount() {

        try{
            String uname=SecurityContextHolder.getContext().getAuthentication().getName();
            usersTableRepository.deleteById(uname);
            previousTableRepo.deleteById(uname);
            HttpHeaders headers = new HttpHeaders();
            ResponseCookie cookie = ResponseCookie.from("entrypasstoken","").httpOnly(true).secure(false).sameSite("Strict").maxAge(0).path("/").build();
            headers.add(HttpHeaders.SET_COOKIE,cookie.toString());
            return new ResponseEntity<>("Account deleted successfully",headers,HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to delete",HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<?> tokenValidation() {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        usersTable user = usersTableRepository.findById(name).orElse(null);
        loginResponse loginRes=new loginResponse(user.getUsername(), user.getPreviousResults());
        return new ResponseEntity<>(loginRes,HttpStatus.OK);
    }
}
