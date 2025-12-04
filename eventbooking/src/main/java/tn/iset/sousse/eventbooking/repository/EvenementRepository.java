package tn.iset.sousse.eventbooking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.iset.sousse.eventbooking.entity.Evenement;

@Repository
public interface EvenementRepository extends JpaRepository<Evenement, Long> {
}
