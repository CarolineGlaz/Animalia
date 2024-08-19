<?php

namespace App\Controller\Admin;

use App\Entity\Produits;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IntegerField;

class ProduitsCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Produits::class;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('nom')->setLabel('Nom'),
            TextField::new('description')->setLabel('Description'),
            ChoiceField::new('categorie')
                ->setLabel('Catégories')
                ->setChoices([
                    'Alimentation' => 'ALIMENTATION',
                    'Accessoires' => 'ACCESSOIRES',
                    'Santé et Bien-être' => 'SANTE',
                    'Habitat' => 'HABITAT',
                ])
                ->setFormTypeOptions(['multiple' => true]),
            IntegerField::new('prix')->setLabel('Prix'),
            TextField::new('img')->setLabel('Image'),
        ];
    }
}
