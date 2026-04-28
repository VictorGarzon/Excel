<?php

namespace App\Controller;

use App\Entity\Acceso;
use App\Entity\Fichero;
use App\Entity\TiposFichero;
use App\Entity\User;
use DateTime;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use InvalidArgumentException;
use PhpParser\Builder\Class_;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api', name: 'api_fichero')]
class FicheroController extends AbstractController
{
    #[Route('/fichero', name: 'home_fichero', methods: ['get'])]
    public function index(EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        $user = $this->getEntityUser($entityManager);
        $permiso = $request->query->get('permiso');
        if ($permiso) {
            $accesos = $user->getAccesosByPermiso($permiso);
        } else {
            $accesos = $user->getAccesos();
        }
        $accesoFicheros = [];
        foreach ($accesos as $acceso) {
            $accesoFicheros[] = [
                "id" => $acceso->getFichero()->getId(),
                "nombre" => $acceso->getFichero()->getNombre(),
                "descripcion" => $acceso->getFichero()->getDescripcion(),
                "fecha_creacion" => $acceso->getFichero()->getFechaCreacion()->format("Y-m-d H:i:s"),
                "fecha_mod" => $acceso->getFichero()->getFechaMod()->format("Y-m-d H:i:s"),
                "ultima_subida" => $acceso->getFichero()->getUltimaSubida()->getEmail(),
                "tipo" => $acceso->getFichero()->getTipoFichero()->getNombre(),
                "permiso" => $acceso->getPermiso()
            ];
        }
        return new JsonResponse($accesoFicheros, status: 201);
    }

    #[Route('/fichero/{id}', name: 'fichero_id', methods: ['get'])]
    public function getId(EntityManagerInterface $entityManager, int $id): JsonResponse
    {
        $user = $this->getEntityUser($entityManager);
        $fichero = $entityManager->getRepository(Fichero::class)->find($id);
        $acceso = $entityManager->getRepository(Acceso::class)->findOneBy(['usuario' => $user, 'fichero' => $fichero]);
        return new JsonResponse(status: 201);
    }

    #[Route('/fichero/{id}/data', name: 'fichero_id_data', methods: ['get'])]
    public function getIdData(EntityManagerInterface $entityManager, int $id): JsonResponse
    {
        $fichero = $entityManager->getRepository(Fichero::class)->find($id);
        return new JsonResponse($fichero->getData(), status: 201);
    }


    #[Route('/fichero/create', name: 'crear_fichero', methods: ['post'])]
    public function create(EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        try {
            $decoded = json_decode($request->getContent());

            $user = $this->getEntityUser($entityManager);

            $fichero = new Fichero();
            if (!isset($decoded->nombre)) {
                throw new InvalidArgumentException("El campo 'nombre' es obligatorio");
            }
            $fichero->setNombre($decoded->nombre);
            $fichero->setDescripcion($decoded->descripcion ?? null);
            $fichero->setUltimaSubida($user);
            $tipo = $decoded->tipo ?? 1;
            $tipo = $entityManager->getRepository(TiposFichero::class)->find($tipo);
            $fichero->setTipoFichero($tipo);
            $fecha = new DateTime();
            $fechaInmutable = DateTimeImmutable::createFromMutable($fecha);
            $fichero->setFechaMod($fecha);
            $fichero->setFechaCreacion($fechaInmutable);
            $entityManager->persist($fichero);
            $entityManager->flush();

            $acceso = new Acceso();
            $acceso->setUser($user);
            $acceso->setFichero($fichero);
            $acceso->setPermiso(3);
            $entityManager->persist($acceso);

            $entityManager->flush();

            return new JsonResponse(status: 201);
        } catch (InvalidArgumentException $err) {
            return new JsonResponse($err->getMessage(), status: 400);
        } catch (Exception $err) {
            return new JsonResponse($err->getMessage(), status: 500);
        }
    }

    public function getEntityUser(EntityManagerInterface $entityManager)
    {
        $email = $this->getUser()->getUserIdentifier();
        return $entityManager
            ->getRepository(User::class)
            ->findOneBy(['email' => $email]);
    }
}
