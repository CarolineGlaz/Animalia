<?php

namespace App\Entity;

use App\Repository\ProduitImageRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\DBAL\Types\JsonType;

#[ORM\Entity(repositoryClass: ProduitImageRepository::class)]
class ProduitImage
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    public ?int $id = null;

    #[ORM\Column]
    public ?int $idProduit = null;

    #[ORM\Column]
    public ?int $idImage = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdProduit(): ?int
    {
        return $this->idProduit;
    }

    public function setIdProduit(int $idProduit): static
    {
        $this->idProduit = $idProduit;

        return $this;
    }

    public function getIdImage(): ?int
    {
        return $this->idImage;
    }

    public function setIdImage(int $idImage): static
    {
        $this->idImage = $idImage;

        return $this;
    }
}
