<?php

namespace App\Entity;

use App\Repository\CardAnimalsRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CardAnimalsRepository::class)]
class CardAnimals
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
   public?int $id = null;

    #[ORM\Column(length: 255)]
   public?string $titre = null;

    #[ORM\Column(type: Types::TEXT)]
   public?string $contenu = null;

   #[ORM\Column(length: 255)]
   public?string $data = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitre(): ?string
    {
        return $this->titre;
    }

    public function setTitre(string $titre): static
    {
        $this->titre = $titre;

        return $this;
    }

    public function getContenu(): ?string
    {
        return $this->contenu;
    }

    public function setContenu(string $contenu): static
    {
        $this->contenu = $contenu;

        return $this;
    }

    public function getData()
    {
        return $this->data;
    }

    public function setData($data): static
    {
        $this->data = $data;

        return $this;
    }
}
