package tn.iset.sousse.eventbooking.controller;

import tn.iset.sousse.eventbooking.entity.*;
import tn.iset.sousse.eventbooking.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/utilisateurs")
@CrossOrigin // global CORS config handles origins/credentials
public class UtilisateurRestController {

    @Autowired
    private UtilisateurService utilisateurService;

    // GET - Récupérer tous les utilisateurs
    @GetMapping
    public ResponseEntity<List<Utilisateur>> getAllUtilisateurs() {
        List<Utilisateur> utilisateurs = utilisateurService.getAllUtilisateurs();
        return ResponseEntity.ok(utilisateurs);
    }

    // GET - Récupérer un utilisateur par ID
    @GetMapping("/{id}")
    public ResponseEntity<Utilisateur> getUtilisateurById(@PathVariable Long id) {
        Optional<Utilisateur> utilisateur = utilisateurService.getUtilisateurById(id);
        return utilisateur
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET - Récupérer un utilisateur par email
    @GetMapping("/email/{email}")
    public ResponseEntity<Utilisateur> getUtilisateurByEmail(@PathVariable String email) {
        Utilisateur utilisateur = utilisateurService.getUtilisateurByEmail(email);
        if (utilisateur != null) {
            return ResponseEntity.ok(utilisateur);
        }
        return ResponseEntity.notFound().build();
    }

    // POST - Inscription d'un nouveau participant
    @PostMapping("/inscription/participant")
    public ResponseEntity<?> inscriptionParticipant(@RequestBody Participant participant) {
        try {
            Utilisateur saved = utilisateurService.saveUtilisateur(participant);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // POST - Inscription d'un nouveau organisateur
    @PostMapping("/inscription/organisateur")
    public ResponseEntity<?> inscriptionOrganisateur(@RequestBody Organisateur organisateur) {
        try {
            organisateur.setApprouve(false); // Par défaut non approuvé
            Utilisateur saved = utilisateurService.saveUtilisateur(organisateur);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // POST - Connexion (authentification basique)
    @PostMapping("/connexion")
    public ResponseEntity<?> connexion(@RequestBody LoginRequest loginRequest) {
        Utilisateur utilisateur = utilisateurService.getUtilisateurByEmail(loginRequest.getEmail());
        
        if (utilisateur == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Email ou mot de passe incorrect");
        }
        
        // Vérification du mot de passe (à améliorer avec BCrypt en production)
        if (!utilisateur.getMotDePasse().equals(loginRequest.getMotDePasse())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Email ou mot de passe incorrect");
        }
        
        return ResponseEntity.ok(utilisateur);
    }

    // PUT - Modifier un utilisateur
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUtilisateur(@PathVariable Long id, @RequestBody Utilisateur utilisateur) {
        Optional<Utilisateur> existingUtilisateur = utilisateurService.getUtilisateurById(id);
        
        if (existingUtilisateur.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        utilisateur.setId(id);
        try {
            Utilisateur updated = utilisateurService.saveUtilisateur(utilisateur);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE - Supprimer un utilisateur
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUtilisateur(@PathVariable Long id) {
        Optional<Utilisateur> utilisateur = utilisateurService.getUtilisateurById(id);
        
        if (utilisateur.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        utilisateurService.deleteUtilisateur(id);
        return ResponseEntity.noContent().build();
    }
    
    // Classe interne pour la requête de connexion
    public static class LoginRequest {
        private String email;
        private String motDePasse;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getMotDePasse() {
            return motDePasse;
        }

        public void setMotDePasse(String motDePasse) {
            this.motDePasse = motDePasse;
        }
    }
}