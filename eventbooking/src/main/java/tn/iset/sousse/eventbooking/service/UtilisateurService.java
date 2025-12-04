package tn.iset.sousse.eventbooking.service;

import tn.iset.sousse.eventbooking.entity.Utilisateur;
import java.util.List;
import java.util.Optional;

public interface UtilisateurService {
    Utilisateur saveUtilisateur(Utilisateur utilisateur);
    List<Utilisateur> getAllUtilisateurs();
    Optional<Utilisateur> getUtilisateurById(Long id);
    Utilisateur getUtilisateurByEmail(String email);
    void deleteUtilisateur(Long id);
    List<Utilisateur> getOrganisateursNonApprouves(); // Nouvelle méthode
}