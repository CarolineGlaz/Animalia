<?php

namespace App\Repository;

use App\Entity\Produits;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ProduitsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Produits::class);
    }

    // Méthode pour obtenir les produits avec pagination et filtrage par catégorie
    public function findAllWithPagination(int $start, int $size, ?string $categorie): array
    {
        $qb = $this->createQueryBuilder('p')
            ->setFirstResult($start)
            ->setMaxResults($size);

        if ($categorie) {
            $qb->andWhere('JSON_CONTAINS(p.categorie, :categorie) = 1')
               ->setParameter('categorie', json_encode($categorie));
        }

        return $qb->getQuery()->getResult();
    }


    // Méthode pour compter le nombre total de produits (avec ou sans catégorie)
    public function countProducts(?string $categorie): int
    {
        $qb = $this->createQueryBuilder('p')
            ->select('COUNT(p.id)');
        
        if ($categorie) {
            $qb->andWhere('JSON_CONTAINS(p.categorie, :categorie) = 1')
               ->setParameter('categorie', json_encode($categorie));
        }
    
        return (int) $qb->getQuery()->getSingleScalarResult();
    }

    // Méthode pour trouver les produits par catégorie avec une requête SQL brute (si nécessaire)
    public function findByCategory(string $categorie): array
    {
        $conn = $this->getEntityManager()->getConnection();
        
        $sql = '
            SELECT * FROM produits p
            WHERE JSON_CONTAINS(p.categorie, :categorie, \'$\')
        ';
        
        $stmt = $conn->prepare($sql);
        $stmt->execute(['categorie' => json_encode($categorie)]);
        
        return $stmt->fetchAll();
    }

        //    /**
    //     * @return Produits[] Returns an array of Produits objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('p.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Produits
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
