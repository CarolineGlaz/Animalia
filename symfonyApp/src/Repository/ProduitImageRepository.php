<?php

// src/Repository/ProduitImageRepository.php
namespace App\Repository;

use App\Entity\ProduitImage;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ProduitImageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ProduitImage::class);
    }

    /**
     * Récupère les images associées à un produit donné.
     *
     * @param int $idProduit
     * @return array
     */
    // Repository pour ProduitImage
    public function findImagesByProduit(int $idProduit): array
    {
        return $this->createQueryBuilder('pi')
            ->select('i') // Sélectionne uniquement les entités Image
            ->innerJoin('App\Entity\Image', 'i', 'WITH', 'pi.idImage = i.id') // Jointure avec l'entité Image
            ->where('pi.idProduit = :idProduit') // Filtrer par idProduit
            ->setParameter('idProduit', $idProduit)
            ->getQuery()
            ->getResult(); // Retourner les entités Image
    }
}

   
    //    /**
    //     * @return ProduitImage[] Returns an array of ProduitImage objects
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

    //    public function findOneBySomeField($value): ?ProduitImage
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
