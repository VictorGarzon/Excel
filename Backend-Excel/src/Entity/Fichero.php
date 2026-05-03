<?php

namespace App\Entity;

use App\Repository\FicheroRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FicheroRepository::class)]
class Fichero
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 20)]
    private ?string $nombre = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $descripcion = null;

    #[ORM\Column(type: Types::JSONB, nullable: true)]
    private mixed $data = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $fecha_creacion = null;

    #[ORM\Column]
    private ?\DateTime $fecha_mod = null;

    #[ORM\ManyToOne(inversedBy: 'ficheros')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $ultima_subida = null;

    /**
     * @var Collection<int, Acceso>
     */
    #[ORM\OneToMany(targetEntity: Acceso::class, mappedBy: 'fichero')]
    private Collection $accesos;

    #[ORM\ManyToOne(inversedBy: 'ficheros')]
    #[ORM\JoinColumn(nullable: false)]
    private ?TiposFichero $tipo_fichero = null;

    public function __construct()
    {
        $this->accesos = new ArrayCollection();
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

    public function getData(): mixed
    {
        return $this->data;
    }

    public function setData(mixed $data): static
    {
        $this->data = $data;

        return $this;
    }

    public function getFechaCreacion(): ?\DateTimeImmutable
    {
        return $this->fecha_creacion;
    }

    public function setFechaCreacion(\DateTimeImmutable $fecha_creacion): static
    {
        $this->fecha_creacion = $fecha_creacion;

        return $this;
    }

    public function getFechaMod(): ?\DateTime
    {
        return $this->fecha_mod;
    }

    public function setFechaMod(\DateTime $fecha_mod): static
    {
        $this->fecha_mod = $fecha_mod;

        return $this;
    }

    public function getUltimaSubida(): ?User
    {
        return $this->ultima_subida;
    }

    public function setUltimaSubida(?User $ultima_subida): static
    {
        $this->ultima_subida = $ultima_subida;

        return $this;
    }

    /**
     * @return Collection<int, Acceso>
     */
    public function getAccesos(): Collection
    {
        return $this->accesos;
    }

    public function addAcceso(Acceso $acceso): static
    {
        if (!$this->accesos->contains($acceso)) {
            $this->accesos->add($acceso);
            $acceso->setFichero($this);
        }

        return $this;
    }

    public function removeAcceso(Acceso $acceso): static
    {
        if ($this->accesos->removeElement($acceso)) {
            // set the owning side to null (unless already changed)
            if ($acceso->getFichero() === $this) {
                $acceso->setFichero(null);
            }
        }

        return $this;
    }

    public function getTipoFichero(): ?TiposFichero
    {
        return $this->tipo_fichero;
    }

    public function setTipoFichero(?TiposFichero $tipo_fichero): static
    {
        $this->tipo_fichero = $tipo_fichero;

        return $this;
    }

    public function getAccesosExcludeUserId(int $id): Collection
    {
        return $this->accesos->filter(
            fn($acceso) => $acceso->getUser()->getId() !== $id
        );
    }
}
