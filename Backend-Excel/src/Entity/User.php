<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    private ?string $email = null;

    /**
     * @var list<string> The user roles
     */
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[ORM\ManyToOne(inversedBy: 'users')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Rol $rol = null;

    /**
     * @var Collection<int, Fichero>
     */
    #[ORM\OneToMany(targetEntity: Fichero::class, mappedBy: 'ultima_subida')]
    private Collection $ficheros;

    /**
     * @var Collection<int, Acceso>
     */
    #[ORM\OneToMany(targetEntity: Acceso::class, mappedBy: 'user')]
    private Collection $accesos;

    public function __construct()
    {
        $this->ficheros = new ArrayCollection();
        $this->accesos = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = $this->rol->getNombre();
        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }


    public function getRol(): ?Rol
    {
        return $this->rol;
    }

    public function setRol(?Rol $rol): static
    {
        $this->rol = $rol;
        $this->setRoles([$rol->getNombre()]);
        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * Ensure the session doesn't contain actual password hashes by CRC32C-hashing them, as supported since Symfony 7.3.
     */
    public function __serialize(): array
    {
        $data = (array) $this;
        $data["\0" . self::class . "\0password"] = hash('crc32c', $this->password);

        return $data;
    }

    #[\Deprecated]
    public function eraseCredentials(): void
    {
        // @deprecated, to be removed when upgrading to Symfony 8
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
            $fichero->setUltimaSubida($this);
        }

        return $this;
    }

    public function removeFichero(Fichero $fichero): static
    {
        if ($this->ficheros->removeElement($fichero)) {
            // set the owning side to null (unless already changed)
            if ($fichero->getUltimaSubida() === $this) {
                $fichero->setUltimaSubida(null);
            }
        }

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
            $acceso->setUser($this);
        }

        return $this;
    }

    public function removeAcceso(Acceso $acceso): static
    {
        if ($this->accesos->removeElement($acceso)) {
            // set the owning side to null (unless already changed)
            if ($acceso->getUser() === $this) {
                $acceso->setUser(null);
            }
        }

        return $this;
    }
}
