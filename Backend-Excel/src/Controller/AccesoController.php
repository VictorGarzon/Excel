<?php

namespace App\Controller;

use App\Entity\Acceso;
use App\Entity\User;
use App\Repository\FicheroRepository;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use InvalidArgumentException;
use PDOException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api', name: 'api_acceso')]
class AccesoController extends AbstractController
{
    #[Route('/acceso', name: 'acceso_get', methods: ['get'])]
    public function index(): JsonResponse
    {
        try {
            return new JsonResponse(status: 201);
        } catch (Exception $err) {
            return new JsonResponse(status: 500);
        }
    }

    #[Route('/acceso', name: 'acceso_post', methods: ['post'])]
    public function create(EntityManagerInterface $entityManager, FicheroRepository $fiRepo, Request $request): JsonResponse
    {
        try {
            $decoded = json_decode($request->getContent());
            $accesoUser = $fiRepo->getAcceso($decoded->id);
            if ($accesoUser->getPermiso() !== 3) {
                throw new Exception("No tienes permiso");
            }
            $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $decoded->email]);
            if (!$user) {
                throw new NotFoundHttpException('Usuario no existe');
            }
            $acceso = new Acceso();
            $acceso->setUser($user);
            $acceso->setFichero($accesoUser->getFichero());
            $acceso->setPermiso($decoded->permiso);
            $entityManager->persist($acceso);
            $entityManager->flush();

            return new JsonResponse(status: 201);
        } catch (NotFoundHttpException $err) {
            return new JsonResponse(status: 404);
        } catch (UniqueConstraintViolationException $err) {
            return new JsonResponse(status: 409);
        } catch (Exception $err) {
            return new JsonResponse($err->getMessage(), status: 500);
        }
    }

    #[Route('/acceso/{id_f}/{id_u}', name: 'acceso_delete', methods: ['delete'])]
    public function delete(EntityManagerInterface $entityManager, FicheroRepository $fiRepo, int $id_f, int $id_u): JsonResponse
    {
        try {
            $accesoUser = $fiRepo->getAcceso($id_f);
            if ($accesoUser->getPermiso() !== 3) {
                throw new Exception("No tienes permiso");
            }
            $acceso = $entityManager->getRepository(Acceso::class)->findOneBy(['user' => $id_u, 'fichero' => $id_f]);
            $entityManager->remove($acceso);
            $entityManager->flush();

            return new JsonResponse(status: 201);
        } catch (Exception $err) {
            return new JsonResponse(status: 500);
        }
    }

    #[Route('/acceso/{id_f}/{id_u}', name: 'acceso_delete', methods: ['patch'])]
    public function editarPermiso(EntityManagerInterface $entityManager, FicheroRepository $fiRepo, Request $request, int $id_f, int $id_u): JsonResponse
    {
        try {
            $accesoUser = $fiRepo->getAcceso($id_f);
            if ($accesoUser->getPermiso() !== 3) {
                throw new Exception("No tienes permiso");
            }
            $acceso = $entityManager->getRepository(Acceso::class)->findOneBy(['user' => $id_u, 'fichero' => $id_f]);
            $decoded = json_decode($request->getContent());
            $acceso->setPermiso($decoded->permiso);
            $entityManager->persist($acceso);
            $entityManager->flush();

            return new JsonResponse(status: 201);
        } catch (Exception $err) {
            return new JsonResponse(status: 500);
        }
    }
}
