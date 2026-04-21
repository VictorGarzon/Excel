<?php

namespace App\Controller;

use App\Entity\Rol;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\User;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Exception;
use PDOException;

#[Route('/api', name: 'api_register')]
class RegistrationController extends AbstractController
{
    #[Route('/register', name: 'register', methods: 'post')]
    public function index(
        ManagerRegistry $doctrine,
        Request $request,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        try {
            $em = $doctrine->getManager();
            $decoded = json_decode($request->getContent());
            $email = $decoded->email;
            $plaintextPassword = $decoded->password;
            $user = new User();
            $user->setEmail($email);
            $hashedPassword = $passwordHasher->hashPassword(
                $user,
                $plaintextPassword
            );
            $user->setPassword($hashedPassword);
            $rol = $em->getRepository(Rol::class)->findOneBy(['nombre' => 'ROLE_USER']);
            $user->setRol($rol);
            $em->persist($user);
            $em->flush();
            return new JsonResponse(status: 201);
        } catch (UniqueConstraintViolationException $err) {
            return new JsonResponse(status: 409);
        } catch (Exception $err) {
            return new JsonResponse(status: 500);
        }
    }
}
