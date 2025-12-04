package tn.iset.sousse.eventbooking.service.impl;

import tn.iset.sousse.eventbooking.entity.Organisateur;
import tn.iset.sousse.eventbooking.entity.Utilisateur;
import tn.iset.sousse.eventbooking.repository.UtilisateurRepository;
import tn.iset.sousse.eventbooking.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UtilisateurServiceImpl implements UtilisateurService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

   @Override
   public Utilisateur saveUtilisateur(Utilisateur utilisateur) {
    if (utilisateur == null) {
        throw new IllegalArgumentException("L'utilisateur ne peut pas être null.");
    }
    if (utilisateur.getEmail() != null && utilisateur.getEmail().trim().isEmpty()) {
        throw new IllegalArgumentException("L'email ne peut pas être vide.");
    }
    
    // MODIFICATION ICI : Ne vérifier que si c'est un NOUVEL utilisateur
    if (utilisateur.getId() == null) {
        Utilisateur existingUtilisateur = utilisateurRepository.findByEmail(utilisateur.getEmail());
        if (existingUtilisateur != null) {
            throw new IllegalArgumentException("Un utilisateur avec cet email existe déjà.");
        }
    }
    
    return utilisateurRepository.save(utilisateur);
     }

    @Override
    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurRepository.findAll();
    }

    @Override
    public Optional<Utilisateur> getUtilisateurById(Long id) {
        return utilisateurRepository.findById(id);
    }

    @Override
    public Utilisateur getUtilisateurByEmail(String email) {
        return utilisateurRepository.findByEmail(email);
    }

    @Override
    public void deleteUtilisateur(Long id) {
        utilisateurRepository.deleteById(id);
    }

    @Override
    public List<Utilisateur> getOrganisateursNonApprouves() {
        return utilisateurRepository.findAll().stream()
                .filter(u -> u instanceof Organisateur && !((Organisateur) u).isApprouve())
                .collect(Collectors.toList());
    }
}