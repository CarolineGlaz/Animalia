<?php

namespace App\Controller;

use App\Entity\Produits;
use App\Repository\ProduitsRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/dashboard')]
class DashBoardProduitController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/get', name: 'get_dashboard_produits', methods: ['GET'])]
    public function getProduit(ProduitsRepository $produitRepository): JsonResponse
    {

        $start = $request->query->get('start', 0);
        $size = $request->query->get('size', 10);
    
        if (!Verify::isPositiveNumber($start)) {
            return new JsonResponse(['message' => "Erreur start"], 404);
        }
        if (!Verify::isPositiveNumber($size)) {
            return new JsonResponse(['message' => "Erreur size"], 404);
        }
    
        $produitsRepository = $this->entityManager->getRepository(Produits::class);
        $produits = $produitsRepository->findAllWithPagination((int) $start, (int) $size, null);

        return $this->json($produits, 200);
    }

    #[Route('/ajouter', name: 'ajouter_produit', methods: ['POST'])]
    public function ajouterProduit(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
    
        $produit = new Produits();
        $produit->setNom($data['nom']);
        $produit->setDescription($data['description']);
        $produit->setCategorie($data['categorie']);
        $produit->setPrix($data['prix']);
        $produit->setImg($data['img']);
    
        $this->entityManager->persist($produit);
        $this->entityManager->flush();
    
        return new JsonResponse(['message' => "Le produit a été ajouté"], 201);
    }


    #[Route('/modifier/{id}', name: 'modifier_dashboard_produit', methods: ['PUT'])]
    public function modifierProduit(int $id, Request $request, ProduitsRepository $produitRepository): JsonResponse
    {
        $produit = $produitRepository->find($id);

        if (!$produit) {
            return new JsonResponse(['message' => 'Produit non trouvé'], 404);
        }

        $data = json_decode($request->getContent(), true);
        $produit->setNom($data['nom']);
        $produit->setDescription($data['description']);
        $produit->setCategorie($data['categorie']);
        $produit->setPrix($data['prix']);
        $produit->setImg($data['img']); 

        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Produit modifié'], 200);
    }

    #[Route('/supprimer/{id}', name: 'supprimer_dashboard_produit', methods: ['DELETE'])]
    public function supprimerProduit(int $id, ProduitsRepository $produitRepository): JsonResponse
    {
        $produit = $produitRepository->find($id);

        if (!$produit) {
            return new JsonResponse(['message' => 'Produit non trouvé'], 404);
        }

        $this->entityManager->remove($produit);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Produit supprimé'], 200);
    }
}
