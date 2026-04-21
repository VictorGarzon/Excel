<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;

#[Route('/api', name: 'api_user')]
class UserController extends AbstractController
{
    #[Route('/user', name: 'user_index', methods: ['get'])]
    public function index(EntityManagerInterface $entityManager): JsonResponse
    {
        $users = $entityManager
            ->getRepository(User::class)
            ->findAll();
        $data = [];
        foreach ($users as $user) {
            $data[] = [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'password' => $user->getPassword(),
                "roles" => $user->getRol()->getNombre(),
            ];
        }
        return new JsonResponse(data: $data, status: 201);
    }
}
