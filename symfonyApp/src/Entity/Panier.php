<?php

// src/Entity/Panier.php
namespace App\Entity;

use App\Repository\PanierRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PanierRepository::class)]
class Panier
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    public ?int $id = null;

    #[ORM\Column(type: 'string', length: 255)]
    public ?string $idUtilisateurs = null;

    #[ORM\Column(type: 'string', length: 255)]
    public ?string $idProduits = null;

    #[ORM\Column(type: 'integer')]
    public int $quantite;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdUtilisateurs(): ?string
    {
        return $this->idUtilisateurs;
    }

    public function setIdUtilisateurs(string $idUtilisateurs): static
    {
        $this->idUtilisateurs = $idUtilisateurs;

        return $this;
    }

    public function getIdProduits(): ?string
    {
        return $this->idProduits;
    }

    public function setIdProduits(string $idProduits): static
    {
        $this->idProduits = $idProduits;

        return $this;
    }

    public function getQuantite(): int
    {
        return $this->quantite;
    }

    public function setQuantite(int $quantite): static
    {
        $this->quantite = $quantite;

        return $this;
    }
}

