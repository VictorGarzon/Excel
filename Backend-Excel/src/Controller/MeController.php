<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use InvalidArgumentException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

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
            "rol" => $rol[0]
        ], status: 201);
    }

    #[Route('/me', name: 'me_edicion', methods: 'patch')]
    public function edit(
        EntityManagerInterface $entityManager,
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        UserRepository $repoUser
    ): JsonResponse {
        try {
            $decoded = json_decode($request->getContent());
            $email = $decoded->email;
            $user = $repoUser->getEntityUser();
            if ($email) {
                $this->validateEmail($email);
                $user->setEmail($email);
            }
            $plaintextNewPassword = $decoded->newpassword;
            $plainPassword = $decoded->password;
            if ($plaintextNewPassword && $plainPassword) {
                $this->validatePassword($plaintextNewPassword);
                if (!$passwordHasher->isPasswordValid($user, $plainPassword)) {
                    return new JsonResponse(status: 401);
                }
                $hashedPassword = $passwordHasher->hashPassword(
                    $user,
                    $plaintextNewPassword
                );
                $user->setPassword($hashedPassword);
            }
            $entityManager->persist($user);
            $entityManager->flush();
            return new JsonResponse(status: 201);
        } catch (InvalidArgumentException $err) {
            return new JsonResponse($err->getMessage(), status: 400);
        } catch (UniqueConstraintViolationException $err) {
            return new JsonResponse(status: 409);
        } catch (Exception $err) {
            return new JsonResponse(status: 500);
        }
    }

    public function validateEmail(string $email): void
    {
        if (empty($email)) {
            throw new InvalidArgumentException('El email es obligatorio.');
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('El email no es válido.');
        }
    }

    public function validatePassword(string $password): void
    {
        if (empty($password)) {
            throw new InvalidArgumentException('La contraseña es obligatoria.');
        }
        if (strlen($password) < 8) {
            throw new InvalidArgumentException('La contraseña debe tener al menos 8 caracteres.');
        }

        $pattern = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/';
        if (!preg_match($pattern, $password)) {
            throw new InvalidArgumentException('La contraseña debe contener: mayúscula, minúscula, número y carácter especial (@$!%*?&).');
        }
    }
}
