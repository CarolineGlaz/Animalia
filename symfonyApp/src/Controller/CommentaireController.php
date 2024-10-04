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
use App\Repository\AvisRepository;
use MongoDB\BSON\ObjectId;

#[Route('/avis')]
class CommentaireController extends AbstractController
{
    private $documentManager;

    public function __construct(DocumentManager $documentManager)
    {
        $this->documentManager = $documentManager;
    }

    #[Route('/get', name: 'app_get_avis', methods: ['GET'])]
    public function getAvis(Request $request, AvisRepository $avisRepository): JsonResponse
    {
        $start = $request->query->get('start', 0);
        $size = $request->query->get('size', 10);
        
        $avisList = $avisRepository->getPaginatedAvis($start, $size, true);

        $data = [];
        foreach ($avisList as $avis) {
            $data[] = [
                'id' => $avis->getId(),
                'nom' => $avis->getNom(),
                'prenom' => $avis->getPrenom(),
                'contenu' => $avis->getContenu(),
                'date' => $avis->getDate()->format('d-m-Y'),
            ];
        }

        $totalAvis = $avisRepository->countAvis(true);

        $json = [
            'data' => $data,
            'countElement' => $totalAvis,
        ];

        return new JsonResponse($json);
    }

    #[Route('/get/unverify-avis', name: 'app_unverify_avis', methods: ['GET'])]
    public function getUnverifyAvis(Request $request, AvisRepository $avisRepository): JsonResponse
    {
        $start = $request->query->get('start', 0);
        $size = $request->query->get('size', 10);
        
        $avisList = $avisRepository->getPaginatedAvis($start, $size, false);

        $data = [];
        foreach ($avisList as $avis) {
            $data[] = [
                'id' => $avis->getId(),
                'nom' => $avis->getNom(),
                'prenom' => $avis->getPrenom(),
                'contenu' => $avis->getContenu(),
                'date' => $avis->getDate()->format('d-m-Y'),
            ];
        }

        $totalAvis = $avisRepository->countAvis(false);

        $json = [
            'data' => $data,
            'countElement' => $totalAvis,
        ];

        return new JsonResponse($json);
    }

    #[Route('/send', name: 'app_post_avis', methods: ['POST'])]
    public function postAvis(Request $req, SessionInterface $session): JsonResponse
    {
        $msg = new Avis();
        $data = json_decode($req->getContent(), true);

        $nom = $data["nom"];
        $prenom = $data["prenom"];
        $temoignage = $data["commentaire"];

        try {
            $msg->setNom($nom);
            $msg->setPrenom($prenom);
            $msg->setDate(new \DateTime());
            $msg->setIsOkay(false);

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

    #[Route('/supprimer/{id}', name: 'app_supprimer_avis', methods: ['DELETE'])]
    public function supprimerAvis(string $id, AvisRepository $avisRepository): JsonResponse
    {
        try {
            $avis = $avisRepository->find(new ObjectId($id));
        } catch (Exception $e) {
            return new JsonResponse(['message' => 'ID de commentaire invalide'], 400);
        }

        if (!$avis) {
            return new JsonResponse(['message' => 'Commentaire non trouvé'], 404);
        }

        $this->documentManager->remove($avis);
        $this->documentManager->flush();

        return new JsonResponse(['message' => 'Commentaire supprimé'], 200);
    }

    #[Route('/accept-comment/{id}', name: 'app_accept_avis', methods: ['PUT'])]
    public function acceptAvis(string $id, Request $req,  AvisRepository $avisRepository): JsonResponse
    {
        $avis = $avisRepository->find(new ObjectId($id));

        try {
            $avis->setIsOkay(true);

            $this->documentManager->persist($avis);
            $this->documentManager->flush();

            $data = ['info' => "."];
        } catch (Exception $e) {
            $data = ['info' => ".."];
        }

        return new JsonResponse($data);
    }
}
