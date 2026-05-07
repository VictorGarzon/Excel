<?php

namespace App\Controller;

use App\Entity\Acceso;
use App\Entity\Fichero;
use App\Entity\TiposFichero;
use App\Entity\User;
use App\Repository\AccesoRepository;
use App\Repository\FicheroRepository;
use App\Repository\UserRepository;
use DateException;
use DateTime;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use InvalidArgumentException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api', name: 'api_fichero')]
class FicheroController extends AbstractController
{
    #[Route('/fichero', name: 'home_fichero', methods: ['get'])]
    public function index(UserRepository $repoUser, FicheroRepository $repoFich, Request $request): JsonResponse
    {
        try {
            $user = $repoUser->getEntityUser();
            $queryFichero = $repoFich->getFicheros($user);
            $permiso = $request->query->get('permiso');
            if ($permiso) {
                $queryFichero->andWhere('a.permiso = :permiso');
                $queryFichero->setParameter('permiso', $permiso);
            }
            $nombre = $request->query->get('nombre');
            if ($nombre) {
                $queryFichero->andWhere('f.nombre like :nombre');
                $queryFichero->setParameter('nombre', '%' . $nombre . '%');
            }
            $ficheros = $queryFichero->getQuery()->getResult();
            $data = [];
            foreach ($ficheros as $fichero) {
                $data[] = [
                    "id" => $fichero[0]->getId(),
                    "nombre" => $fichero[0]->getNombre(),
                    "descripcion" => $fichero[0]->getDescripcion(),
                    "fecha_creacion" => $fichero[0]->getFechaCreacion()->format("Y-m-d H:i:s"),
                    "fecha_mod" => $fichero[0]->getFechaMod()->format("Y-m-d H:i:s"),
                    "ultima_subida" => $fichero[0]->getUltimaSubida()->getEmail(),
                    "tipo" => $fichero[0]->getTipoFichero()->getNombre(),
                    "permiso" => $fichero['permiso']
                ];
            }
            return new JsonResponse($data, status: 201);
        } catch (Exception $err) {
            return new JsonResponse($err->getMessage(), status: 500);
        }
    }

    #[Route('/fichero/{id}', name: 'fichero_id', methods: ['get'])]
    public function getId(FicheroRepository $fiRepo, int $id): JsonResponse
    {
        try {
            $acceso = $fiRepo->getAcceso($id);
            $fichero = $acceso->getFichero();
            $ficheroData = [
                "id" => $fichero->getId(),
                "nombre" => $fichero->getNombre(),
                "descripcion" => $fichero->getDescripcion(),
                "fecha_creacion" => $fichero->getFechaCreacion()->format("Y-m-d H:i:s"),
                "fecha_mod" => $fichero->getFechaMod()->format("Y-m-d H:i:s"),
                "ultima_subida" => $fichero->getUltimaSubida()->getEmail(),
                "tipo" => $fichero->getTipoFichero()->getNombre(),
                "permiso" => $acceso->getPermiso()
            ];
            return new JsonResponse($ficheroData, status: 201);
        } catch (Exception $err) {
            return new JsonResponse($err->getMessage(), status: 500);
        }
    }

    #[Route('/fichero/{id}/data', name: 'fichero_id_data', methods: ['get'])]
    public function getIdData(FicheroRepository $fiRepo, int $id): JsonResponse
    {
        try {
            $acceso = $fiRepo->getAcceso($id);
            $data = $acceso->getFichero()->getData();
            return new JsonResponse($data, status: 201);
        } catch (Exception $err) {
            return new JsonResponse($err->getMessage(), status: 500);
        }
    }

    #[Route('/fichero/{id}/permisos', name: 'fichero_id_permisos', methods: ['get'])]
    public function getIdPermisos(FicheroRepository $fiRepo, int $id): JsonResponse
    {
        try {
            $acceso = $fiRepo->getAcceso($id);
            $fichero = $acceso->getFichero();
            $acs = $fichero->getAccesosExcludeUserId($acceso->getUser()->getId());
            $result = [];
            foreach ($acs as $value) {
                $result[] = [
                    'id' => $value->getUser()->getId(),
                    'email' => $value->getUser()->getEmail(),
                    'permiso' => $value->getPermiso(),
                ];
            }
            return new JsonResponse($result, status: 201);
        } catch (Exception $err) {
            return new JsonResponse($err->getMessage(), status: 500);
        }
    }


    #[Route('/fichero', name: 'crear_fichero', methods: ['post'])]
    public function create(EntityManagerInterface $entityManager, UserRepository $repoUser, Request $request): JsonResponse
    {
        try {
            $decoded = json_decode($request->getContent());

            $user = $repoUser->getEntityUser();

            $fichero = new Fichero();
            if (!isset($decoded->nombre)) {
                throw new InvalidArgumentException("El campo 'nombre' es obligatorio");
            }
            $fichero->setNombre($decoded->nombre);
            $fichero->setDescripcion($decoded->descripcion ?? null);
            $fichero->setData($decoded->data ?? null);
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

            return new JsonResponse($fichero->getId(), status: 201);
        } catch (InvalidArgumentException $err) {
            return new JsonResponse($err->getMessage(), status: 400);
        } catch (Exception $err) {
            return new JsonResponse($err->getMessage(), status: 500);
        }
    }

    #[Route('/fichero/{id}', name: 'fichero_modificar', methods: ['patch'])]
    public function modificar(EntityManagerInterface $entityManager, FicheroRepository $fiRepo, Request $request, int $id): JsonResponse
    {
        try {
            $decoded = json_decode($request->getContent());
            $acceso = $fiRepo->getAcceso($id);
            if ($acceso->getPermiso() == 1) {
                throw new AccessDeniedHttpException("No tienes permiso");
            }
            $fichero = $acceso->getFichero();
            if (isset($decoded->nombre) && $fichero->getNombre() != $decoded->nombre) {
                $fichero->setNombre($decoded->nombre);
            }
            if (isset($decoded->descripcion) && $fichero->getDescripcion() != $decoded->descripcion) {
                $fichero->setDescripcion($decoded->descripcion);
            }
            if (isset($decoded->data) && $fichero->getData() != $decoded->data) {
                if (isset($decoded->acept) && $decoded->acept == false) {
                    $fecha_ul_mod = $fichero->getFechaMod();
                    $fecha_mod = new DateTime($decoded->fecha_mod);
                    if ($fecha_ul_mod != $fecha_mod) {
                        throw new DateException('fecha de modificacion posterior');
                    }
                }
                $fichero->setData($decoded->data);
                $user = $acceso->getUser();
                $fichero->setUltimaSubida($user);
                $fecha = new DateTime();
                $fichero->setFechaMod($fecha);
            }
            $entityManager->persist($fichero);
            $entityManager->flush();

            return new JsonResponse($fichero->getFechaMod()->format("Y-m-d H:i:s"), status: 201);
        } catch (AccessDeniedHttpException $err) {
            return new JsonResponse(status: 403);
        } catch (DateException $err) {
            return new JsonResponse(status: 409);
        } catch (Exception $err) {
            return new JsonResponse($err->getMessage(), status: 500);
        }
    }

    #[Route('/fichero/{id}', name: 'fichero_delete', methods: ['delete'])]
    public function delete(EntityManagerInterface $entityManager, FicheroRepository $fiRepo, int $id): JsonResponse
    {
        try {
            $accesoUser = $fiRepo->getAcceso($id);
            if ($accesoUser->getPermiso() !== 3) {
                throw new Exception("No tienes permiso");
            }
            $entityManager->remove($accesoUser->getFichero());
            $entityManager->flush();

            return new JsonResponse(status: 201);
        } catch (Exception $err) {
            return new JsonResponse(status: 500);
        }
    }
}
