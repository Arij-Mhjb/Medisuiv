package com.medisuiv.alertes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/alertes")
public class AlerteController {

    @Autowired
    private AlerteRepository alerteRepository;

    // GET all alertes
    @GetMapping
    public List<Alerte> getAll() {
        return alerteRepository.findAll();
    }

    // GET one alerte by id
    @GetMapping("/{id}")
    public Alerte getById(@PathVariable Long id) {
        return alerteRepository.findById(id).orElse(null);
    }

    // POST create new alerte
    @PostMapping
    public Alerte create(@RequestBody Alerte alerte) {
        return alerteRepository.save(alerte);
    }

    // PUT update alerte
    @PutMapping("/{id}")
    public Alerte update(@PathVariable Long id, @RequestBody Alerte alerte) {
        alerte.setId(id);
        return alerteRepository.save(alerte);
    }

    // DELETE alerte
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        alerteRepository.deleteById(id);
    }
}