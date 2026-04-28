<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api', name: 'api_home')]
class HomeController extends AbstractController
{
    #[Route('/home', name: 'home_index', methods: ['get'])]
    public function index(): JsonResponse
    {
        $email = $this->getUser()->getUserIdentifier();
        $rol = $this->getUser()->getRoles();

        return new JsonResponse(data: [
            "email" => $email,
            "rol" => $rol[0]
        ], status: 201);
    }
}
