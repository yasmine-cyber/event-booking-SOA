package tn.iset.sousse.eventbooking.controller;

import tn.iset.sousse.eventbooking.entity.Evenement;
import tn.iset.sousse.eventbooking.service.EvenementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/evenements")
@CrossOrigin // global CORS config handles origins/credentials
public class EvenementRestController {

    @Autowired
    private EvenementService evenementService;

    // GET - Récupérer tous les événements
    @GetMapping
    public ResponseEntity<List<Evenement>> getAllEvenements() {
        List<Evenement> evenements = evenementService.getAllEvenements();
        return ResponseEntity.ok(evenements);
    }

    // GET - Récupérer tous les événements actifs seulement
    @GetMapping("/actifs")
    public ResponseEntity<List<Evenement>> getEvenementsActifs() {
        List<Evenement> evenements = evenementService.getAllEvenements()
                .stream()
                .filter(Evenement::isActif)
                .collect(Collectors.toList());
        return ResponseEntity.ok(evenements);
    }

    // GET - Récupérer un événement par ID
    @GetMapping("/{id}")
    public ResponseEntity<Evenement> getEvenementById(@PathVariable Long id) {
        Optional<Evenement> evenement = evenementService.getEvenementById(id);
        return evenement
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST - Créer un nouvel événement
    @PostMapping
    public ResponseEntity<?> createEvenement(@RequestBody Evenement evenement) {
        try {
            evenement.setActif(true); // Par défaut actif
            Evenement saved = evenementService.saveEvenement(evenement);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PUT - Modifier un événement
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvenement(@PathVariable Long id, @RequestBody Evenement evenement) {
        Optional<Evenement> existingEvenement = evenementService.getEvenementById(id);

        if (existingEvenement.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        evenement.setId(id);
        try {
            Evenement updated = evenementService.saveEvenement(evenement);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PATCH - Désactiver un événement
    @PatchMapping("/{id}/desactiver")
    public ResponseEntity<?> desactiverEvenement(@PathVariable Long id) {
        Optional<Evenement> evenementOpt = evenementService.getEvenementById(id);

        if (evenementOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Evenement evenement = evenementOpt.get();
        evenement.setActif(false);
        Evenement updated = evenementService.saveEvenement(evenement);
        return ResponseEntity.ok(updated);
    }

    // PATCH - Activer un événement
    @PatchMapping("/{id}/activer")
    public ResponseEntity<?> activerEvenement(@PathVariable Long id) {
        Optional<Evenement> evenementOpt = evenementService.getEvenementById(id);

        if (evenementOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Evenement evenement = evenementOpt.get();
        evenement.setActif(true);
        Evenement updated = evenementService.saveEvenement(evenement);
        return ResponseEntity.ok(updated);
    }

    // DELETE - Supprimer un événement
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvenement(@PathVariable Long id) {
        Optional<Evenement> evenement = evenementService.getEvenementById(id);

        if (evenement.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        evenementService.deleteEvenement(id);
        return ResponseEntity.noContent().build();
    }

    // GET - Rechercher des événements par lieu
    @GetMapping("/search/lieu")
    public ResponseEntity<List<Evenement>> searchByLieu(@RequestParam String lieu) {
        List<Evenement> evenements = evenementService.getAllEvenements()
                .stream()
                .filter(e -> e.getLieu().toLowerCase().contains(lieu.toLowerCase()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(evenements);
    }

    // GET - Rechercher des événements par titre
    @GetMapping("/search/titre")
    public ResponseEntity<List<Evenement>> searchByTitre(@RequestParam String titre) {
        List<Evenement> evenements = evenementService.getAllEvenements()
                .stream()
                .filter(e -> e.getTitre().toLowerCase().contains(titre.toLowerCase()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(evenements);
    }
}
