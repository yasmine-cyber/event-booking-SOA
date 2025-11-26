package tn.iset.sousse.eventbooking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.iset.sousse.eventbooking.entity.Utilisateur;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Utilisateur findByEmail(String email);
}

//JpaRepository fournit déjà toutes les méthodes classiques CRUD comme :

//save()

//findById()

//findAll()

//delete()

//etc
