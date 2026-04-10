package com.medisuiv.alertes;

public class VitalAlertEvent {

    private Long patientId;
    private String type;
    private Double valeur;
    private Double seuil;

    public VitalAlertEvent() {}

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Double getValeur() { return valeur; }
    public void setValeur(Double valeur) { this.valeur = valeur; }

    public Double getSeuil() { return seuil; }
    public void setSeuil(Double seuil) { this.seuil = seuil; }
}