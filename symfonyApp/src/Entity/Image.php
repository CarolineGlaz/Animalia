<?php

namespace App\Entity;

use App\Repository\ImageRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ImageRepository::class)]
class Image
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    public ?int $id = null;

    #[ORM\Column(length: 255)]
    public ?string $alt = null;

    #[ORM\Column(type: Types::BLOB)]
    public $data;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getalt(): ?string
    {
        return $this->alt;
    }

    public function setalt(string $alt): static
    {
        $this->alt = $alt;

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
