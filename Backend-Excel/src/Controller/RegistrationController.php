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
use InvalidArgumentException;
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
            $this->validateEmail($email);
            $plaintextPassword = $decoded->password;
            $this->validatePassword($plaintextPassword);
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
