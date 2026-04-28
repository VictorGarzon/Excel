<?php

namespace App\Controller;

use App\Entity\TiposFichero;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api', name: 'api_tipos')]
class TiposFicheroController extends AbstractController
{
    #[Route('/tipos', name: 'tipos_index', methods: ['get'])]
    public function index(EntityManagerInterface $entityManager): JsonResponse
    {
        $tipos = $entityManager
            ->getRepository(TiposFichero::class)
            ->findAll();
        $data = [];
        foreach ($tipos as $tipo) {
            $data[] = [
                'id' => $tipo->getId(),
                'nombre' => $tipo->getNombre()
            ];
        }
        return new JsonResponse(data: $data, status: 201);
    }
}
