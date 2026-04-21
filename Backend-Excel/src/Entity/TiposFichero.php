<?php

namespace App\Entity;

use App\Repository\TiposFicheroRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TiposFicheroRepository::class)]
class TiposFichero
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 20)]
    private ?string $nombre = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $descripcion = null;

    /**
     * @var Collection<int, Fichero>
     */
    #[ORM\OneToMany(targetEntity: Fichero::class, mappedBy: 'tipo_fichero')]
    private Collection $ficheros;

    public function __construct()
    {
        $this->ficheros = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNombre(): ?string
    {
        return $this->nombre;
    }

    public function setNombre(string $nombre): static
    {
        $this->nombre = $nombre;

        return $this;
    }

    public function getDescripcion(): ?string
    {
        return $this->descripcion;
    }

    public function setDescripcion(?string $descripcion): static
    {
        $this->descripcion = $descripcion;

        return $this;
    }

    /**
     * @return Collection<int, Fichero>
     */
    public function getFicheros(): Collection
    {
        return $this->ficheros;
    }

    public function addFichero(Fichero $fichero): static
    {
        if (!$this->ficheros->contains($fichero)) {
            $this->ficheros->add($fichero);
            $fichero->setTipoFichero($this);
        }

        return $this;
    }

    public function removeFichero(Fichero $fichero): static
    {
        if ($this->ficheros->removeElement($fichero)) {
            // set the owning side to null (unless already changed)
            if ($fichero->getTipoFichero() === $this) {
                $fichero->setTipoFichero(null);
            }
        }

        return $this;
    }
}
