<?php

namespace App\Controller;

use App\Entity\TiposFichero;
use Doctrine\ORM\EntityManagerInterface;
use Proxies\__CG__\App\Entity\Rol;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api', name: 'api_rol')]
class RolController extends AbstractController
{
    #[Route('/rol', name: 'rol_index', methods: ['get'])]
    public function index(EntityManagerInterface $entityManager): JsonResponse
    {
        $roles = $entityManager
            ->getRepository(Rol::class)
            ->findAll();
        $data = [];
        foreach ($roles as $rol) {
            $data[] = [
                'id' => $rol->getId(),
                'nombre' => $rol->getNombre()
            ];
        }
        return new JsonResponse(data: $data, status: 201);
    }
}
