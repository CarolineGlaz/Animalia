<?php

namespace App\Controller;

use App\Document\Avis;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class CommentaireController extends AbstractController
{
    private $documentManager;

    public function __construct(DocumentManager $documentManager)
    {
        $this->documentManager = $documentManager;
    }

    #[Route('/avis', name: 'app_get_avis', methods: ['GET'])]
    public function getAvis(): JsonResponse
    {
        // Récupérer tous les avis validés (isOkay == true)
        $repository = $this->documentManager->getRepository(Avis::class);
        $avisList = $repository->findBy(['isOkay' => true]);

        $data = [];
        foreach ($avisList as $avis) {
            $data[] = [
                'nom' => $avis->getNom(),
                'prenom' => $avis->getPrenom(),
                'contenu' => $avis->getContenu(),
                'date' => $avis->getDate()->format('d-m-Y'),
            ];
        }

        return new JsonResponse($data);
    }
}
