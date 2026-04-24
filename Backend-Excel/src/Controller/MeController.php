<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Csrf\TokenStorage\TokenStorageInterface;

#[Route('/api', name: 'api_me')]
class MeController extends AbstractController
{
    #[Route('/me', name: 'me_index', methods: ['get'])]
    public function index(): JsonResponse
    {
        $email = $this->getUser()->getUserIdentifier();
        $rol = $this->getUser()->getRoles();

        return new JsonResponse(data: [
            "email" => $email,
            "rol"=>$rol[0]
        ], status: 201);
    }
}
