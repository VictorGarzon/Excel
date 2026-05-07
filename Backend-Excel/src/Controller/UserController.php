<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\FicheroRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use InvalidArgumentException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[Route('/api', name: 'api_user')]
class UserController extends AbstractController
{
    #[Route('/user', name: 'user_index', methods: ['get'])]
    public function index(Request $request, UserRepository $repoUser): JsonResponse
    {
        $queryUsers = $repoUser->getUsers();
        $rol = $request->query->get('rol');
        if ($rol) {
            $queryUsers->andWhere('u.rol = :rol');
            $queryUsers->setParameter('rol', $rol);
        }
        $email = $request->query->get('email');
        if ($email) {
            $queryUsers->andWhere('u.email like :email');
            $queryUsers->setParameter('email', '%' . $email . '%');
        }
        $users = $queryUsers->getQuery()->getResult();
        $data = [];
        foreach ($users as $user) {
            $data[] = [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                "rol" => $user->getRol()->getNombre(),
            ];
        }
        return new JsonResponse(data: $data, status: 201);
    }

    #[Route('/user/{id}', name: 'user_patch_pass', methods: ['patch'])]
    public function updatePass(
        EntityManagerInterface $entityManager,
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        int $id
    ): JsonResponse {
        try {
            $decoded = json_decode($request->getContent());
            $plaintextPassword = $decoded->password;
            $this->validatePassword($plaintextPassword);
            $user = $entityManager
                ->getRepository(User::class)
                ->find($id);
            $hashedPassword = $passwordHasher->hashPassword(
                $user,
                $plaintextPassword
            );
            $user->setPassword($hashedPassword);
            $entityManager->persist($user);
            $entityManager->flush();
            return new JsonResponse(status: 201);
        } catch (InvalidArgumentException $err) {
            return new JsonResponse($err->getMessage(), status: 400);
        } catch (Exception $err) {
            return new JsonResponse(status: 500);
        }
    }

    #[Route('/user/{id}', name: 'delete_user', methods: ['delete'])]
    public function delete(
        EntityManagerInterface $entityManager,
        FicheroRepository $repoFic,
        int $id
    ): JsonResponse {
        try {
            $user = $entityManager->getRepository(User::class)->find($id);
            $repoFic->deleteUser($user);
            $entityManager->remove($user);
            $entityManager->flush();
            return new JsonResponse(status: 201);
        } catch (Exception $err) {
            return new JsonResponse($err->getMessage(), status: 500);
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
