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
}