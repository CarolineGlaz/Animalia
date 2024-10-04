<?php

namespace App\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use DateTime;
use App\Repository\AvisRepository;

#[MongoDB\Document(repositoryClass: AvisRepository::class)]
class Avis
{
  #[MongoDB\Id]
  public ?string $id = null;

  #[MongoDB\Field(type: "string")]
  public string $nom;

  #[MongoDB\Field(type: "string")]
  public string $prenom;

  #[MongoDB\Field(type: "date")]
  public DateTime $date;

  #[MongoDB\Field(type: "string")]
  public string $contenu;

  #[MongoDB\Field(type: "bool")]
  public bool $isOkay;

  public function getId(): ?string
  {
    return $this->id;
  }

  public function getNom(): string
  {
    return $this->nom;
  }

  public function getPrenom(): string
  {
    return $this->prenom;
  }

  public function getDate(): DateTime
  {
    return $this->date;
  }

  public function getContenu(): string
  {
    return $this->contenu;
  }

  public function isOkay(): bool
  {
    return $this->isOkay;
  }

  public function setId(?string $id): void
  {
    $this->id = $id;
  }

  public function setNom(string $nom): void
  {
    $this->nom = $nom;
  }

  public function setPrenom(string $prenom): void
  {
    $this->prenom = $prenom;
  }

  public function setDate(DateTime $date): void
  {
    $this->date = $date;
  }

  public function setContenu(string $contenu): void
  {
    $this->contenu = $contenu;
  }

  public function setIsOkay(bool $isOkay): void
  {
    $this->isOkay = $isOkay;
  }
}
