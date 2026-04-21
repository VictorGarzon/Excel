<?php

namespace App\Entity;

use App\Repository\AccesoRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AccesoRepository::class)]
class Acceso
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $permiso = null;

    #[ORM\ManyToOne(inversedBy: 'accesos')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'accesos')]
    #[ORM\JoinColumn(nullable: false)]
    private ?fichero $fichero = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPermiso(): ?int
    {
        return $this->permiso;
    }

    public function setPermiso(int $permiso): static
    {
        $this->permiso = $permiso;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getFichero(): ?fichero
    {
        return $this->fichero;
    }

    public function setFichero(?fichero $fichero): static
    {
        $this->fichero = $fichero;

        return $this;
    }
}
