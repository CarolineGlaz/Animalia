<?php

namespace App\Controller;

use App\Document\Avis;
use Doctrine\ODM\MongoDB\DocumentManager;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
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

    #[Route('/sendavis', name: 'app_post_avis')]
    public function postAvis(Request $req, SessionInterface $session): JsonResponse
    {

        $msg = new Avis();

        $data = json_decode($req->getContent(), true);

        if (!(isset($data["nom"]) && isset($data["prenom"]) && isset($data["commentaire"]))) {
            return new JsonResponse(['message' => 'Données post manquante']);
        }

        $nom = $data["nom"];
        $prenom = $data["prenom"];
        $temoignage = $data["commentaire"];


        try {
            $msg->setNom($nom);
            $msg->setPrenom($prenom);
            $msg->setDate(new \DateTime());
            $msg->setIsOkay(true);

            if (!empty($temoignage)) {
                $msg->setContenu($temoignage);
            }

            $this->documentManager->persist($msg);
            $this->documentManager->flush();

            $data = ['info' => "Ton commentaire a bien été envoyé à notre équipe, merci $prenom !"];
        } catch (Exception $e) {
            $data = ['info' => "Une erreur s'est produite lors de l'envoi de ton commentaire."];
        }

        return new JsonResponse($data);
    }
}
