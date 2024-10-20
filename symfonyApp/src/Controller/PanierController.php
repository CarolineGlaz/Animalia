<?php

namespace App\Controller;

use App\Entity\Panier;
use App\Entity\Produits;
use App\Repository\PanierRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Utils\Verify;

use function PHPUnit\Framework\isNan;

#[Route('/panier')]
class PanierController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/get', name: 'get_panier', methods: ['GET'])]
    public function getPanier(Request $request, PanierRepository $panierRepository): JsonResponse
    {
        $session = $request->getSession();

        if(!$session->has('isLogged') || $session->get('isLogged') == false){
            return new JsonResponse(['message' => 'Vous êtes pas connecté'], 404);
        }
        $idUtilisateur = $session->get('user_id');

        $panierDetails = $panierRepository->findPanierWithProduits($idUtilisateur);

        $jsonResult = [];
        for ($i = 0; $i < count($panierDetails); $i += 2) {
            $object = $panierDetails[$i];
            $object['produit'] = $panierDetails[$i + 1];
            $jsonResult[$i / 2] = $object;
        }

        return new JsonResponse($jsonResult, 200);
    }

    #[Route('/modifier/{id}', name: 'modifier_panier', methods: ['PUT'])]
    public function modifierPanier(int $id, Request $request): JsonResponse
    {
        $panierArticle = $this->entityManager->getRepository(Panier::class)->find($id);

        if (!$panierArticle) {
            return new JsonResponse(['message' => 'Article non trouvé'], 404);
        }

        $data = json_decode($request->getContent(), true);

        $session = $request->getSession();

        if(!$session->has('isLogged') || $session->get('isLogged') == false){
            return new JsonResponse(['message' => 'Vous êtes pas connecté'], 404);
        }
        $idUtilisateur = $session->get('user_id');

        if (!Verify::isPositiveNumber($data['quantite'])) {
            return new JsonResponse(['message' => 'Erreur de lecture de la quantité'], 404);
        }

        if ($panierArticle->getIdUtilisateur() != $idUtilisateur) {
            return new JsonResponse(['message' => "Droit d'accès refusé"], 403);
        }

        if ($data['quantite'] == 0) {
            return $this->supprimerPanier($id, $request);
        }
        $panierArticle->setQuantite((int) $data['quantite']);
        $this->entityManager->flush();

        return new JsonResponse(['status' => 'Article modifié avec succès'], 200);
    }

    #[Route('/supprimer/{id}', name: 'supprimer_panier', methods: ['DELETE'])]
    public function supprimerPanier(int $id, Request $request): JsonResponse
    {
        $session = $request->getSession();

        if(!$session->has('isLogged') || $session->get('isLogged') == false){
            return new JsonResponse(['message' => 'Vous êtes pas connecté'], 404);
        }
        $idUtilisateur = $session->get('user_id');

        $panierArticle = $this->entityManager->getRepository(Panier::class)->find($id);

        if (!$panierArticle) {
            return new JsonResponse(['message' => 'Article non trouvé'], 404);
        }

        if ($panierArticle->getIdUtilisateur() != $idUtilisateur) {
            return new JsonResponse(['message' => "Droit d'accès refusé"], 403);
        }

        $this->entityManager->remove($panierArticle);
        $this->entityManager->flush();

        return new JsonResponse(['status' => 'Article supprimé du panier'], 200);
    }

    #[Route('/ajouter/{id}', name: 'ajouter_panier', methods: ['POST'])]
    public function ajouterPanier(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!Verify::isPositiveNumber($data['quantite'])) {
            return new JsonResponse(['message' => 'Quantité non trouvée'], 400);
        }
        $quantite = (int) $data['quantite'];

        $session = $request->getSession();

        if(!$session->has('isLogged') || $session->get('isLogged') == false){
            return new JsonResponse(['message' => 'Vous êtes pas connecté'], 401);
        }
        $idUtilisateur = $session->get('user_id');

        $panierArticle = $this->entityManager->getRepository(Panier::class)->findOneBy([
            'idProduit' => $id,
            'idUtilisateur' => $idUtilisateur,
        ]);

        if ($panierArticle) {
            $panierArticle->setQuantite($panierArticle->getQuantite() + $quantite);
        } else {
            $produit = $this->entityManager->getRepository(Produits::class)->find($id);
            if (!$produit) {
                return new JsonResponse(['message' => "Produit non trouvé"], 404);
            }

            $panierArticle = new Panier();
            $panierArticle->setIdProduit($produit->getId());
            $panierArticle->setQuantite($quantite);
            $panierArticle->setIdUtilisateur($idUtilisateur);

            $this->entityManager->persist($panierArticle);
        }

        $this->entityManager->flush();

        return new JsonResponse(['message' => "L'article a été ajouté au panier"], 200);
    }
}
