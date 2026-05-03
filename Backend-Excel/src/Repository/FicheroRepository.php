<?php

namespace App\Repository;

use App\Entity\Fichero;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Exception;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

/**
 * @extends ServiceEntityRepository<Fichero>
 */
class FicheroRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry, private UserRepository $userRepository, private AccesoRepository $accesoRepository)
    {
        parent::__construct($registry, Fichero::class);
    }

    public function getAcceso(int $id)
    {
        $user = $this->userRepository->getEntityUser();
        $acceso = $this->accesoRepository->findOneBy(['user' => $user, 'fichero' => $id]);
        if (empty($acceso)) {
            throw new AccessDeniedHttpException("No tienes acceso a ese fichero");
        }
        return $acceso;
    }

    //    /**
    //     * @return Fichero[] Returns an array of Fichero objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('f')
    //            ->andWhere('f.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('f.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Fichero
    //    {
    //        return $this->createQueryBuilder('f')
    //            ->andWhere('f.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
