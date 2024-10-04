<?php

namespace App\Repository;

use App\Document\Avis;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ODM\MongoDB\Repository\DocumentRepository;

class AvisRepository extends DocumentRepository
{
    public function __construct(DocumentManager $dm)
    {
        parent::__construct($dm, $dm->getUnitOfWork(),
           $dm->getClassMetadata(Avis::class));
    }

    public function findByIsOkay(bool $isOkay): array
    {
        return $this->findBy(['isOkay' => $isOkay]);
    }

    public function countAvis($isOkay)
    {
        return $this->createQueryBuilder()
            ->field('isOkay')->equals($isOkay)
            ->count()
            ->getQuery()
            ->execute();
    }

    public function getPaginatedAvis($start, $size, $isOkay)
    {
        return $this->createQueryBuilder()
            ->field('isOkay')->equals($isOkay) 
            ->skip($start) 
            ->limit($size)
            ->getQuery()
            ->execute();
    }
}